import { Nitro } from '../../Nitro';
import { GenericAlertMessagesComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class CommandsListCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'commands');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;

        const commands = Nitro.gameManager.commandManager.getCommandList(user);

        if(!commands) return;

        const totalCommands = commands.length;

        if(!totalCommands) return;

        const validCommands = [];

        validCommands.push(`Commands Available ( ${ commands.length } )`);

        validCommands.push(`? is an optional parameter\r[] can take multiple arguments seperated by a space`);

        for(let i = 0; i < totalCommands; i++)
        {
            const command = commands[i];

            if(!command) continue;

            if(command === this) continue;

            validCommands.push(`Name: ${ command.constructor.name }\rDescription: ${ command.description }\rUsage: < ${ command.aliases.join(', ') } > ${ command.usage }`);
        }

        if(validCommands.length) return user.connections.processOutgoing(new GenericAlertMessagesComposer(...validCommands));
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Command List';
    }
}