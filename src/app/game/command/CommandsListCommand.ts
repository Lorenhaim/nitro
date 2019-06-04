import { Emulator } from '../../Emulator';
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

        const commands = Emulator.gameManager.commandManager.getCommandList(user);

        if(!commands) return;

        const totalCommands = commands.length;

        if(!totalCommands) return;

        const validCommands = [];

        validCommands.push(`Commands Available ( ${ commands.length } )`);

        for(let i = 0; i < totalCommands; i++)
        {
            const command = commands[i];

            if(!command) continue;

            if(command === this) continue;

            validCommands.push(`Name: ${ command.constructor.name }\rDescription: ${ command.description }\rUsage: ${ command.aliases }`);
        }

        if(validCommands.length) return user.connections.processOutgoing(new GenericAlertMessagesComposer(...validCommands));
    }

    public get description(): string
    {
        return 'Commands';
    }
}