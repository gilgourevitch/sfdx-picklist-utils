/* eslint-disable */
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
import * as fs from 'node:fs';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Connection, Messages } from '@salesforce/core';
import { CustomField, CustomValue, GlobalValueSet, StandardValueSet } from '@jsforce/jsforce-node/lib/api/metadata.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-picklist-utils', 'picklistutils.updatevalues');

export type PicklistutilsUpdatevaluesResult = {
  path: string;
};

export default class PicklistutilsUpdatevalues extends SfCommand<PicklistutilsUpdatevaluesResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    fieldapiname: Flags.string({
      summary: messages.getMessage('flags.fieldapiname.summary'),
      char: 'a',
      required: true,
    }),
    filename: Flags.string({
      summary: messages.getMessage('flags.filename.summary'),
      char: 'f',
      required: true,
    }),
    separator: Flags.string({
      summary: messages.getMessage('flags.separator.summary'),
      char: 's',
    }),
    eol: Flags.string({
      summary: messages.getMessage('flags.eol.summary'),
      char: 'e',
    }),
    'target-org': Flags.requiredOrg(),
    'api-version': Flags.orgApiVersion(),
    'has-columns-labels': Flags.boolean({
      summary: messages.getMessage('flags.has-columns-labels.summary'),
      char: 'l',
    }),
  };

  public async run(): Promise<PicklistutilsUpdatevaluesResult> {
    const { flags } = await this.parse(PicklistutilsUpdatevalues);
    const conn = flags['target-org'].getConnection(flags['api-version']);
    const separator = flags['separator'] || ',';
    const eol = flags['eol'] || '\n';
    const fieldApiName = flags['fieldapiname'];
    const hascolumnslabels = flags['has-columns-labels'] || false;

    this.spinner.start('Getting Metadata');
    const fieldValues: CustomValue[] = (await this.getFieldValues(conn, fieldApiName)) || [];
    this.spinner.stop('✅');

    this.spinner.start('Parsing file');
    let csvValues: { [key: string]: string } = this.parseFile(flags['filename'], hascolumnslabels, separator, eol);
    this.spinner.stop('✅');

    // Replace old values by new ones.
    let valuesToDeactivate: CustomValue[] = [];
    fieldValues.forEach((fieldValue) => {
      const label = fieldValue?.label;
      if (label && fieldValue.fullName != csvValues[label]) {
        var newVal = csvValues[label];

        if (newVal != undefined) {
          let valtodeactivate: CustomValue = Object.assign({}, fieldValue);
          valtodeactivate.isActive = false;
          valuesToDeactivate.push(valtodeactivate);
          fieldValue.fullName = newVal;
        }
      }
    });

    let newValues: CustomValue[] = [];
    Object.entries(csvValues).forEach((csvValue) => {
      newValues.push({
        fullName: csvValue[1],
        label: csvValue[0],
        isActive: true,
      } as CustomValue);
    });

    // Deactivate old values
    if (valuesToDeactivate.length > 0) {
      this.spinner.start('Deactivating old values');
      await this.updateValues(conn, fieldApiName, valuesToDeactivate);
      this.spinner.stop('✅');
    }

    this.spinner.start('Updating new values');
    await this.updateValues(conn, fieldApiName, newValues);
    this.spinner.stop('✅');

    return {
      path: 'src/commands/picklistutils/updatevalues.ts',
    };
  }

  public async updateValues(conn: Connection, fieldName: string, valuesToUpdate: CustomValue[]) {
    let updateResult;

    if (!this.isCustomField(fieldName)) {
      // standard field, update globalValueSet
      const standardValueSetMetadata = (await conn.metadata.read('StandardValueSet', [fieldName]))[0];
      updateResult = await conn.metadata.update('StandardValueSet', [
        {
          fullName: standardValueSetMetadata.fullName,
          standardValue: valuesToUpdate,
        },
      ]);
    } else {
      // custom field
      const fieldMetadata = (await conn.metadata.read('CustomField', [fieldName]))[0];
      let valueSetName = fieldMetadata?.valueSet?.valueSetName;

      if (valueSetName) {
        //global picklist
        const globalValueSetMetadata = (await conn.metadata.read('GlobalValueSet', [valueSetName]))[0];
        updateResult = await conn.metadata.update('GlobalValueSet', [
          {
            fullName: globalValueSetMetadata.fullName + '__gvs',
            masterLabel: globalValueSetMetadata.masterLabel,
            customValue: valuesToUpdate,
          },
        ]);
      } else {
        // local picklist
        updateResult = await conn.metadata.update('CustomField', [
          {
            fullName: fieldName,
            type: 'Picklist',
            label: fieldMetadata.label,
            valueSet: {
              valueSetDefinition: {
                value: valuesToUpdate,
              },
            },
          },
        ]);
      }
    }

    if (!updateResult[0]?.success) {
      this.error('Error : ' + updateResult[0]?.errors[0]?.statusCode + ' - ' + updateResult[0]?.errors[0]?.message);
    }
  }

  // eslint-disable-next-line
  public async getFieldValues(conn: Connection, fieldName: string) {
    let fieldValues: CustomValue[] | undefined = [];
    let fieldMetadata: CustomField;
    let globalValueSetMetadata: GlobalValueSet;
    let standardValueSetMetadata: StandardValueSet;

    if (!this.isCustomField(fieldName)) {
      // Standard field, get StandardValueSet values
      standardValueSetMetadata = (await conn.metadata.read('StandardValueSet', [fieldName]))[0];

      if (!standardValueSetMetadata?.standardValue || standardValueSetMetadata?.standardValue.length == 0) {
        // not working
        this.error('When updating standard field, fill the StandardValueSet name instead of field name.');
      } else {
        fieldValues = standardValueSetMetadata?.standardValue;
      }
    } else {
      // custom field get field metadata
      fieldMetadata = (await conn.metadata.read('CustomField', [fieldName]))[0];

      // eslint-disable-next-line
      if (!fieldMetadata?.fullName) {
        this.error('Unknown field : ' + fieldName);
        return;
      }

      let valueSetName = fieldMetadata?.valueSet?.valueSetName;
      if (valueSetName) {
        // global picklist get GlobalValueSet values
        globalValueSetMetadata = (await conn.metadata.read('GlobalValueSet', [valueSetName]))[0];
        fieldValues = globalValueSetMetadata.customValue || [];
      } else {
        // local picklist, get values
        fieldValues = fieldMetadata?.valueSet?.valueSetDefinition?.value || [];
      }
      // console.log('-----------------',fieldValues);
    }

    if (!Array.isArray(fieldValues)) {
      fieldValues = [fieldValues];
    }

    return fieldValues;
  }

  // eslint-disable-next-line class-methods-use-this
  public isCustomField(fieldName: string): boolean {
    return fieldName.includes('__c');
  }

  public parseFile(fileName: string, hascolumnslabels: boolean, separator: string, endOfLine: string) {
    // var fs = require('fs');
    let contents = fs.readFileSync(fileName, 'utf-8').split(endOfLine);

    if(hascolumnslabels){
      contents.shift();
    } 

    //Parse csv file.
    let csvValues: {
      [key: string]: string;
    } = {};

    contents.forEach((line: string) => { 
      let csvColumn: string[] = line.split(separator);

      if (csvColumn[0] != '') {
        csvValues[csvColumn[0]] = csvColumn[1];
      }
    });

    return csvValues;
  }
}
