import { Emulator } from '../../../../Emulator';
import { MessengerRoomInviteComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerRoomInviteEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const totalIds = this.packet.readInt();

            if(!totalIds) return;

            const userIds: number[] = [];

            for(let i = 0; i < totalIds; i++) userIds.push(this.packet.readInt());

            const totalUserIds = userIds.length;

            if(!totalUserIds) return;

            const message = this.packet.readString();

            for(let i = 0; i < totalUserIds; i++)
            {
                const userId = userIds[i];

                if(!userId) continue;

                if(!this.client.user.messenger.hasFriend(userId)) continue;

                const user = Emulator.gameManager.userManager.getUserById(userIds[i]);

                if(!user) continue;

                user.connections.processOutgoing(new MessengerRoomInviteComposer(this.client.user.id, message));
            }
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