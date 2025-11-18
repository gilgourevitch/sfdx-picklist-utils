import { Connection } from '@salesforce/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CustomField, CustomValue, GlobalValueSet, StandardValueSet } from '@jsforce/jsforce-node/lib/api/metadata.js';

// eslint-disable-next-line class-methods-use-this
export const isCustomField = (fieldName: string): boolean => fieldName.includes('__c');

// eslint-disable-next-line
export const getFieldValues = async function (conn: Connection, fieldName: string) {
  let fieldValues: CustomValue[] | undefined = [];
  let fieldMetadata: CustomField;
  let globalValueSetMetadata: GlobalValueSet;
  let standardValueSetMetadata: StandardValueSet;

  if (!isCustomField(fieldName)) {
    // Standard field, get StandardValueSet values
    standardValueSetMetadata = (await conn.metadata.read('StandardValueSet', [fieldName]))[0];

    if (!standardValueSetMetadata?.standardValue || standardValueSetMetadata?.standardValue.length === 0) {
      // not working
      throw new Error('When updating standard field, fill the StandardValueSet name instead of field name.');
    } else {
      fieldValues = standardValueSetMetadata?.standardValue;
    }
  } else {
    // custom field get field metadata
    fieldMetadata = (await conn.metadata.read('CustomField', [fieldName]))[0];

    // eslint-disable-next-line
    if (!fieldMetadata?.fullName) {
      throw new Error('Unknown field : ' + fieldName);
    }

    const valueSetName = fieldMetadata?.valueSet?.valueSetName;
    if (valueSetName) {
      // global picklist get GlobalValueSet values
      globalValueSetMetadata = (await conn.metadata.read('GlobalValueSet', [valueSetName]))[0];
      fieldValues = globalValueSetMetadata.customValue || [];
    } else {
      // local picklist, get values
      fieldValues = fieldMetadata?.valueSet?.valueSetDefinition?.value ?? [];
    }
    // console.log('-----------------',fieldValues);
  }

  if (!Array.isArray(fieldValues)) {
    fieldValues = [fieldValues];
  }

  return fieldValues;
};
