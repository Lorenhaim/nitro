import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserPermissionsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_PERMISSIONS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.info())
            {
                this.packet.writeInt(2); // club level
                this.packet.writeInt(this.user.rankId); // rank id
                this.packet.writeBoolean(false); //is ambassador

                this.packet.prepare();

                return this.packet;
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}