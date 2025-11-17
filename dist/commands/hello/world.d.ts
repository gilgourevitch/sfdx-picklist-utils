import { SfCommand } from '@salesforce/sf-plugins-core';
export type HelloWorldResult = {
    name: string;
    time: string;
};
export default class World extends SfCommand<HelloWorldResult> {
    static readonly summary: string;
    static readonly description: string;
    static readonly examples: string[];
    static readonly flags: {
        name: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<HelloWorldResult>;
}
