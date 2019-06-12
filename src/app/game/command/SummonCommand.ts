import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class SummonCommand extends Command
{
    constructor()
    {
        super(PermissionList.SUMMON_USER, 'summon');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit || !parts) return;
        
        const currentRoom = user.unit.room;

        if(!currentRoom) return;
        
        const username = parts[0];

        if(!username || username === user.details.username) return;
        
        const onlineUser = Nitro.gameManager.userManager.getUserByUsername(username);

        if(!onlineUser || !onlineUser.unit) return;

        if(onlineUser.unit.room !== currentRoom) onlineUser.unit.fowardRoom(currentRoom.id);
    }

    public get usage(): string
    {
        return `< username >`;
    }

    public get description(): string
    {
        return 'Brings a user to you';
    }
}