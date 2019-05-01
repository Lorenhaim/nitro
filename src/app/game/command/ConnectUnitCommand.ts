import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class ConnectUnitCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'cu', 'connectunit');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit || !parts) return;

        const type  = parts[0];
        const name  = parts[1];

        if(!type || !name) return;
        
        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        if(type === 'pet')
        {
            const pet = currentRoom.petManager.getPetByName(name);

            if(!pet) return;

            user.unit.connectUnit(pet.unit);
        }
    }
}