import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RoomSpectateCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'spectate');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        user.unit.spectate(true);
        // set some var, this composer needs to be sent after entering but before the map loads
        //user.connections.processOutgoing(new RoomSpectatorComposer());
    }

    public get description(): string
    {
        return 'Turns on spectator mode';
    }
}