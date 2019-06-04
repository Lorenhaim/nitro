import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class PullCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'pull');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user && user.unit && parts)
        {
            const currentRoom = user.unit.room;

            if(currentRoom)
            {
                const username = parts[0];
                const extended = parts[1];

                if(username && extended)
                {
                    if(username === 'pet')
                    {
                        const pet = currentRoom.petManager.getPetByName(extended);

                        if(pet) pet.unit.location.walkTo(user.unit.location.position.getPositionInfront());
                    }
                }

                else if(username && username !== user.details.username)
                {
                    //
                }
            }
        }
    }

    public get description(): string
    {
        return 'Pulls a unit towards you';
    }
}