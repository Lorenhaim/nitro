import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class UnloadRoomCommand extends Command
{
    constructor()
    {
        super(PermissionList.UNLOAD_ROOM, 'unload_room', 'ur');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;

        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        if(!user.unit.isOwner()) return;

        await Nitro.gameManager.roomManager.removeRoom(currentRoom);
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Unloads the room';
    }
}