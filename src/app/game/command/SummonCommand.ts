import { Emulator } from '../../Emulator';
import { GenericAlertComposer } from '../../packets';
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
        if(user && user.unit && parts)
        {
            const currentRoom = user.unit.room;

            if(currentRoom)
            {
                const username = parts[0];

                if(username && username !== user.details.username)
                {
                    const onlineUser = Emulator.gameManager.userManager.getUserByUsername(username);

                    if(onlineUser && onlineUser.unit)
                    {
                        if(onlineUser.unit.room && onlineUser.unit.room.id === currentRoom.id) return;

                        await onlineUser.unit.fowardRoom(currentRoom.id);
                    }
                    else
                    {
                        user.connections.processOutgoing(new GenericAlertComposer('Invalid User'));
                    }
                }
            }
        }
    }
}