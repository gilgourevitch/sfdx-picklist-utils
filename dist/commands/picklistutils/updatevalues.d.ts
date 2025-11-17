import { SfCommand } from '@salesforce/sf-plugins-core';
import { Connection } from '@salesforce/core';
import { CustomValue } from '@jsforce/jsforce-node/lib/api/metadata.js';
export type PicklistutilsUpdatevaluesResult = {
    path: string;
};
export default class PicklistutilsUpdatevalues extends SfCommand<PicklistutilsUpdatevaluesResult> {
    static readonly summary: string;
    static readonly description: string;
    static readonly examples: string[];
    static readonly flags: {
        fieldapiname: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        filename: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        separator: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        eol: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'target-org': import("@oclif/core/interfaces").OptionFlag<import("@salesforce/core").Org, import("@oclif/core/interfaces").CustomOptions>;
        'api-version': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'has-columns-labels': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<PicklistutilsUpdatevaluesResult>;
    updateValues(conn: Connection, fieldName: string, valuesToUpdate: CustomValue[]): Promise<void>;
    getFieldValues(conn: Connection, fieldName: string): Promise<CustomValue[] | undefined>;
    isCustomField(fieldName: string): boolean;
    parseFile(fileName: string, hascolumnslabels: boolean, separator: string, endOfLine: string): {
        [key: string]: string;
    };
}
