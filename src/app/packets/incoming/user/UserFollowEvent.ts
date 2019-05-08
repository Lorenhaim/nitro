import { Emulator } from '../../../Emulator';
import { Incoming } from '../Incoming';

export class UserFollowEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const messengerFriend = this.client.user.messenger.getFriend(this.packet.readInt());

            if(!messengerFriend) return;

            const friend = Emulator.gameManager.userManager.getUserById(messengerFriend.id);

            if(!friend) return;

            if(!friend.unit.room) return;

            this.client.user.unit.fowardRoom(friend.unit.room.id);
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}