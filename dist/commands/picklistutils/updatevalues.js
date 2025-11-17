/* eslint-disable */
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
import * as fs from 'node:fs';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-picklist-utils', 'picklistutils.updatevalues');
export default class PicklistutilsUpdatevalues extends SfCommand {
    static summary = messages.getMessage('summary');
    static description = messages.getMessage('description');
    static examples = messages.getMessages('examples');
    static flags = {
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
    async run() {
        const { flags } = await this.parse(PicklistutilsUpdatevalues);
        const conn = flags['target-org'].getConnection(flags['api-version']);
        const separator = flags['separator'] || ',';
        const eol = flags['eol'] || '\n';
        const fieldApiName = flags['fieldapiname'];
        const hascolumnslabels = flags['has-columns-labels'] || false;
        this.spinner.start('Getting Metadata');
        const fieldValues = (await this.getFieldValues(conn, fieldApiName)) || [];
        this.spinner.stop('✅');
        this.spinner.start('Parsing file');
        let csvValues = this.parseFile(flags['filename'], hascolumnslabels, separator, eol);
        console.log("yo !");
        console.log(csvValues);
        this.spinner.stop('✅');
        // Replace old values by new ones.
        let valuesToDeactivate = [];
        fieldValues.forEach((fieldValue) => {
            const label = fieldValue?.label;
            if (label && fieldValue.fullName != csvValues[label]) {
                var newVal = csvValues[label];
                if (newVal != undefined) {
                    let valtodeactivate = Object.assign({}, fieldValue);
                    valtodeactivate.isActive = false;
                    valuesToDeactivate.push(valtodeactivate);
                    fieldValue.fullName = newVal;
                }
            }
        });
        let newValues = [];
        Object.entries(csvValues).forEach((csvValue) => {
            newValues.push({
                fullName: csvValue[1],
                label: csvValue[0],
                isActive: true,
            });
        });
        // Deactivate old values
        if (valuesToDeactivate.length > 0) {
            this.spinner.start('Deactivating old values');
            // await this.updateValues(conn, fieldApiName, valuesToDeactivate);
            this.spinner.stop('✅');
        }
        this.spinner.start('Updating new values');
        // await this.updateValues(conn, fieldApiName, newValues);
        this.spinner.stop('✅');
        return {
            path: 'src/commands/picklistutils/updatevalues.ts',
        };
    }
    async updateValues(conn, fieldName, valuesToUpdate) {
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
        }
        else {
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
            }
            else {
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
    async getFieldValues(conn, fieldName) {
        let fieldValues = [];
        let fieldMetadata;
        let globalValueSetMetadata;
        let standardValueSetMetadata;
        if (!this.isCustomField(fieldName)) {
            // Standard field, get StandardValueSet values
            standardValueSetMetadata = (await conn.metadata.read('StandardValueSet', [fieldName]))[0];
            if (!standardValueSetMetadata?.standardValue || standardValueSetMetadata?.standardValue.length == 0) {
                // not working
                this.error('When updating standard field, fill the StandardValueSet name instead of field name.');
            }
            else {
                fieldValues = standardValueSetMetadata?.standardValue;
            }
        }
        else {
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
            }
            else {
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
    isCustomField(fieldName) {
        return fieldName.includes('__c');
    }
    parseFile(fileName, hascolumnslabels, separator, endOfLine) {
        // var fs = require('fs');
        let contents = fs.readFileSync(fileName, 'utf-8').split(endOfLine);
        if (hascolumnslabels) {
            contents.shift();
        }
        //Parse csv file.
        let csvValues = {};
        contents.forEach((line) => {
            let csvColumn = line.split(separator);
            if (csvColumn[0] != '') {
                csvValues[csvColumn[0]] = csvColumn[1];
            }
        });
        return csvValues;
    }
}
//# sourceMappingURL=updatevalues.js.map