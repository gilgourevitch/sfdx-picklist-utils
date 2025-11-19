/* eslint-disable */
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
import * as fs from 'node:fs';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { CustomValue } from '@jsforce/jsforce-node/lib/api/metadata.js';
import * as common from '../../common/lib.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-picklist-utils', 'picklistutils.generatefile');

export type PicklistutilsGeneratefileResult = {
  path: string;
};

export default class PicklistutilsGeneratefile extends SfCommand<PicklistutilsGeneratefileResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'output-file': Flags.string({
      summary: messages.getMessage('flags.output-file.summary'),
      char: 'f',
      required: true,
    }),
    'field-api-name': Flags.string({
      summary: messages.getMessage('flags.field-api-name.summary'),
      char: 'a',
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
    'include-columns-labels': Flags.boolean({
      summary: messages.getMessage('flags.include-columns-labels.summary'),
      char: 'l',
    }),
  };

  public async run(): Promise<PicklistutilsGeneratefileResult> {
    const { flags } = await this.parse(PicklistutilsGeneratefile);
    const conn = flags['target-org'].getConnection(flags['api-version']);
    const separator = flags['separator'] || ',';
    const eol = flags['eol'] || '\n';
    const fieldApiName = flags['field-api-name'];
    const includeColumnsLabels = flags['include-columns-labels'] || false;

    this.spinner.start('Getting Metadata');
    const fieldValues: CustomValue[] = (await common.getFieldValues(conn, fieldApiName)) || [];
    this.spinner.stop('✅');

    this.spinner.start('Generating file');
    await this.generateFile(flags['output-file'], fieldValues, separator, eol, includeColumnsLabels);
    this.spinner.stop('✅');

    return {
      path: 'src/commands/picklistutils/generatefile.ts',
    };
  }

  public async generateFile(
    outputFile: string,
    fieldValues: CustomValue[],
    separator: string,
    eol: string,
    includeColumnsLabels: boolean
  ) {
    let outputContent = '';

    if (includeColumnsLabels) {
      outputContent += 'Label' + separator + 'API Name' + eol;
    }

    fieldValues.forEach((value: CustomValue) => {
      outputContent += value.label + separator + value.fullName + eol;
    });

    fs.writeFileSync(outputFile, outputContent, 'utf-8');
  }
}
