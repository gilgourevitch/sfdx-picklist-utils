/* eslint-disable */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Connection, Messages } from '@salesforce/core';
import { CustomField, CustomValue, GlobalValueSet, StandardValueSet } from '@jsforce/jsforce-node/lib/api/metadata.js';

// eslint-disable-next-line
Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)));
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
  };

  public async run(): Promise<PicklistutilsUpdatevaluesResult> {
    const { flags } = await this.parse(PicklistutilsUpdatevalues);
    const conn = flags['target-org'].getConnection(flags['api-version']);

    this.spinner.start('Getting Metadata');
    const fieldValues = await this.getFieldValues(conn, flags['fieldapiname']);
    // eslint-disable-next-line
    console.log(fieldValues);
    this.spinner.stop('done !');

    this.spinner.start('Parsing file');
    // let csvValues = this.parseFile(flags['filename'], flags['separator'], flags['eol']);
    this.spinner.stop('done !');

    // eslint-disable-next-line
    // console.log(csvValues);

    return {
      path: 'src/commands/picklistutils/updatevalues.ts',
    };
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

      // eslint-disable-next-line
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

  // public parseFile(fileName: string, separator: string, endOfLine: string){
  //   var fs = require('fs');
  //   let contents = fs.readFileSync(fileName, 'utf-8').split(endOfLine);

  //   //Parse csv file.
  //   let csvValues: string[] = [];

  //   contents.forEach((line: string) => {
  //       let csvColumn: string[] = line.split(separator);
  //       if(csvColumn[0] != ''){
  //           csvValues[csvColumn[0]] = csvColumn[1];
  //       }
  //   });

  //   return csvValues;
  // }
}
