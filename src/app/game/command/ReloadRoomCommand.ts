import { PermissionList } from '../security';
import { UnitType } from '../unit';
import { User } from '../user';
import { Command } from './Command';

export class ReloadRoomCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'reloadRoom', 'rr');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;

        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        const users: User[] = [];

        const totalUnits = currentRoom.unitManager.units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const unit = currentRoom.unitManager.units[i];

                if(!unit) continue;

                if(unit.type !== UnitType.USER) continue;

                users.push(unit.user);
            }
        }

        await currentRoom.reload();

        setTimeout(() =>
        {
            const totalReloadUsers = users.length;

            if(!totalReloadUsers) return;

            for(let i = 0; i < totalReloadUsers; i++)
            {
                const activeUser = users[i];
                
                if(!activeUser || !activeUser.unit) continue;
                
                activeUser.unit.fowardRoom(currentRoom.id);
            }
        }, 300);
    }

    public get description(): string
    {
        return 'Reloads the room and brings all users back';
    }
}