import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class SummonCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'summon');
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

        if(onlineUser.unit.room !== currentRoom)
        {
            await onlineUser.unit.fowardRoom(currentRoom.id);
        }

        onlineUser.unit.location.walkToUnit(user.unit, false);

        //onlineUser.unit.location.setGoalAction(onlineUser.unit.location.lookAtPosition, onlineUser.unit.location.position);
    }

    public get description(): string
    {
        return 'Brings a user to you';
    }
}