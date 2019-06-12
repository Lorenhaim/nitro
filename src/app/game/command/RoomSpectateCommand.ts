import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RoomSpectateCommand extends Command
{
    constructor()
    {
        super(PermissionList.ROOM_SPECTATE, 'room_spectate', 'spectate');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        user.unit.spectate(true);
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Turns on spectator mode';
    }
}