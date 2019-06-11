import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class UnloadRoomCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'unload');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;

        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        await Nitro.gameManager.roomManager.removeRoom(currentRoom);
    }

    public get description(): string
    {
        return 'Unloads the room';
    }
}