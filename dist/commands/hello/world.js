import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('sfdx-picklist-utils', 'hello.world');
export default class World extends SfCommand {
    static summary = messages.getMessage('summary');
    static description = messages.getMessage('description');
    static examples = messages.getMessages('examples');
    static flags = {
        name: Flags.string({
            char: 'n',
            summary: messages.getMessage('flags.name.summary'),
            description: messages.getMessage('flags.name.description'),
            default: 'World',
        }),
    };
    async run() {
        const { flags } = await this.parse(World);
        const time = new Date().toDateString();
        this.log(messages.getMessage('info.hello', [flags.name, time]));
        return {
            name: flags.name,
            time,
        };
    }
}
//# sourceMappingURL=world.js.map