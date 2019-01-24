import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserBadgesComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_BADGES, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated) return this.cancel();

            this.packet.writeInt(this.user.userId);
            this.packet.writeInt(0); // total badges

            //foreach
            //this.packet.writeInt(0); // slot number 1-5
            //this.packet.writeString(''); // badge code
            
            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}