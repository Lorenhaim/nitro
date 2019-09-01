import { Manager } from '../../common';
import { User } from '../user';
import { AboutCommand } from './AboutCommand';
import { ActionCommand } from './ActionCommand';
import { Command } from './Command';
import { CommandsListCommand } from './CommandsListCommand';
import { CoordinatesCommand } from './CoordinatesCommand';
import { CreditsCommand } from './CreditsCommand';
import { DanceCommand } from './DanceCommand';
import { EffectCommand } from './EffectCommand';
import { EjectAllCommand } from './EjectAllCommand';
import { FastWalkCommand } from './FastWalkCommand';
import { GiveBadgeCommand } from './GiveBadgeCommand';
import { HandItemCommand } from './HandItemCommand';
import { HotelAlertCommand } from './HotelAlertCommand';
import { PickupAllCommand } from './PickupAllCommand';
import { PullCommand } from './PullCommand';
import { PullFurniCommand } from './PullFurniCommand';
import { RebootCommand } from './RebootCommand';
import { ReloadRoomCommand } from './ReloadRoomCommand';
import { RollDiceCommand } from './RollDiceCommand';
import { RoomSpectateCommand } from './RoomSpectateCommand';
import { SetFigureCommand } from './SetFigureCommand';
import { ShutdownCommand } from './ShutdownCommand';
import { SitCommand } from './SitCommand';
import { SummonCommand } from './SummonCommand';
import { ToggleLocationCommand } from './ToggleLocationCommand';
import { UnloadRoomCommand } from './UnloadRoomCommand';
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
    }

    protected async onDispose(): Promise<void>
    {
        this._commands = [];
    }

    public getCommand(nameOrAlias: string): Command
    {
        const totalCommands = this._commands.length;

        if(!totalCommands) return null;
        
        for(let i = 0; i < totalCommands; i++)
        {
            const command = this._commands[i];

            if(!command) continue;

            if(command.aliases.indexOf(nameOrAlias) === -1) continue;

            return command;
        }

        return null;
    }

    public async processMessageAsCommand(user: User, message: string): Promise<boolean>
    {
        if(!user) return false;

        if(!message) return false;

        if(message.charAt(0) !== ':') return false;
        
        const parts = message.substr(1).split(' ');

        if(!parts.length) return false;
        
        const command = this.getCommand(parts[0]);

        if(!command) return false;

        if(command.permission &&!user.hasPermission(command.permission)) return false;
        
        parts.splice(0, 1);

        await command.process(user, parts);

        return true;
    }

    public registerCommand(command: Command): void
    {
        const totalAliases = command.aliases.length;

        if(!totalAliases) return;
        
        for(let i = 0; i < totalAliases; i++)
        {
            const alias = command.aliases[i];

            if(this.getCommand(alias)) return;
        }

        this._commands.push(command);
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

        if(validatedCommands.length) return validatedCommands;

        return null;
    }

    private loadCommands(): void
    {
        this.registerCommand(new AboutCommand());
        this.registerCommand(new ActionCommand());
        this.registerCommand(new CommandsListCommand());
        this.registerCommand(new CoordinatesCommand());
        this.registerCommand(new CreditsCommand());
        this.registerCommand(new DanceCommand());
        this.registerCommand(new EffectCommand());
        this.registerCommand(new EjectAllCommand());
        this.registerCommand(new FastWalkCommand());
        this.registerCommand(new GiveBadgeCommand());
        this.registerCommand(new HandItemCommand());
        this.registerCommand(new HotelAlertCommand());
        this.registerCommand(new PickupAllCommand());
        this.registerCommand(new PullCommand());
        this.registerCommand(new PullFurniCommand());
        this.registerCommand(new RebootCommand());
        this.registerCommand(new ReloadRoomCommand());
        this.registerCommand(new RollDiceCommand());
        this.registerCommand(new RoomSpectateCommand());
        this.registerCommand(new SetFigureCommand());
        this.registerCommand(new ShutdownCommand());
        this.registerCommand(new SitCommand());
        this.registerCommand(new SummonCommand());
        this.registerCommand(new ToggleLocationCommand());
        this.registerCommand(new UnloadRoomCommand());
        this.registerCommand(new UpdateCatalogCommand());
        this.registerCommand(new UpdateItemsCommand());

        this.logger.log(`Loaded ${ this._commands.length } commands`);
    }
}