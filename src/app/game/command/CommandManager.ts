import { Manager } from '../../common';
import { User } from '../user';
import { AboutCommand } from './AboutCommand';
import { Command } from './Command';
import { ConnectUnitCommand } from './ConnectUnitCommand';
import { CoordinatesCommand } from './CoordinatesCommand';
import { CreditsCommand } from './CreditsCommand';
import { EjectAllCommand } from './EjectAllCommand';
import { GenerateAccountsCommand } from './GenerateAccountsCommand';
import { GiveBadgeCommand } from './GiveBadgeCommand';
import { HotelAlertCommand } from './HotelAlertCommand';
import { LayCommand } from './LayCommand';
import { PickupAllCommand } from './PickupAllCommand';
import { PullCommand } from './PullCommand';
import { RebootCommand } from './RebootCommand';
import { RefreshInventoryCommand } from './RefreshInventoryCommand';
import { RollDiceCommand } from './RollDiceCommand';
import { RoomSpectateCommand } from './RoomSpectateCommand';
import { ShutdownCommand } from './ShutdownCommand';
import { SitCommand } from './SitCommand';
import { StopLocatingCommand } from './StopLocatingCommand';
import { SummonCommand } from './SummonCommand';
import { UpdateCatalogCommand } from './UpdateCatalogCommand';
import { UpdateItemsCommand } from './UpdateItemsCommand';

export class CommandManager extends Manager
{
    private _commands: Command[];

    constructor()
    {
        super('CommandManager');

        this._commands = [];
    }

    protected async onInit(): Promise<void>
    {
        this.loadCommands();
        
        this.logger.log(`Loaded ${ this._commands.length } commands`);
    }

    protected async onDispose(): Promise<void>
    {
        this._commands = [];
    }

    public getCommand(nameOrAlias: string): Command
    {
        const totalCommands = this._commands.length;

        if(totalCommands)
        {
            for(let i = 0; i < totalCommands; i++)
            {
                const command = this._commands[i];

                if(command.aliases.indexOf(nameOrAlias) >= 0) return command;
            }
        }

        return null;
    }

    public removeCommand(nameOrAlias: string): void
    {
        const totalCommands = this._commands.length;

        if(totalCommands)
        {
            for(let i = 0; i < totalCommands; i++)
            {
                const command = this._commands[i];

                if(command.aliases.indexOf(nameOrAlias) >= 0)
                {
                    this._commands.splice(i, 1);

                    return;
                }
            }
        }

        return null;
    }

    public registerCommand(command: Command): void
    {
        const totalAliases = command.aliases.length;

        if(totalAliases)
        {
            for(let i = 0; i < totalAliases; i++)
            {
                const alias = command.aliases[i];

                if(this.getCommand(alias)) return;
            }

            this._commands.push(command);
        }
    }

    public getCommandList(user: User): Command[]
    {
        if(!user) return null;

        const totalCommands = this._commands.length;

        if(!totalCommands) return null;

        const validatedCommands: Command[] = [];

        for(let i = 0; i < totalCommands; i++)
        {
            const command = this._commands[i];

            if(!command) continue;

            if(command.permission !== null && !user.hasPermission(command.permission)) continue;

            validatedCommands.push(command);
        }
    }

    private loadCommands(): void
    {
        this.registerCommand(new AboutCommand());
        this.registerCommand(new CoordinatesCommand());
        this.registerCommand(new CreditsCommand());
        this.registerCommand(new GiveBadgeCommand());
        this.registerCommand(new HotelAlertCommand());
        this.registerCommand(new LayCommand());
        this.registerCommand(new SitCommand());
        this.registerCommand(new SummonCommand());
        this.registerCommand(new UpdateItemsCommand());
        this.registerCommand(new ShutdownCommand());
        this.registerCommand(new RebootCommand());
        this.registerCommand(new UpdateCatalogCommand());
        this.registerCommand(new RefreshInventoryCommand());
        this.registerCommand(new PickupAllCommand());
        this.registerCommand(new EjectAllCommand());
        this.registerCommand(new StopLocatingCommand());
        this.registerCommand(new RollDiceCommand());
        this.registerCommand(new PullCommand());
        this.registerCommand(new ConnectUnitCommand());
        this.registerCommand(new RoomSpectateCommand());
        this.registerCommand(new GenerateAccountsCommand());
    }
}