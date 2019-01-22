import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerRemoveComposer extends Outgoing
{
    constructor(_user: User, private readonly _userIds: number[])
    {
        super(OutgoingHeader.MESSENGER_UPDATE, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            this.packet.writeInt(0);

            const totalUsers = this._userIds.length;

            if(!totalUsers)
            {
                this.packet.writeInt(0);
            }
            else
            {
                this.packet.writeInt(totalUsers);

                for(let i = 0; i < totalUsers; i++)
                {
                    this.packet.writeInt(-1);
                    this.packet.writeInt(this._userIds[i]);
                }
            }

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}