import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserSanctionStatusComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_SANCTION_STATUS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated) return this.cancel();

            this.packet.writeBoolean(false);
            this.packet.writeBoolean(false);
            this.packet.writeString('test1');
            this.packet.writeInt(1);
            this.packet.writeInt(1); // doesnt use
            this.packet.writeString('test2'); // sanction reason
            this.packet.writeString(TimeHelper.formatDate(TimeHelper.now, 'MMMM DD, YYYY HH:mm')); // start time
            this.packet.writeInt(1);
            this.packet.writeString('test4');
            this.packet.writeInt(1);
            this.packet.writeInt(1); // doesnt use
            this.packet.writeBoolean(false); // ??
            this.packet.writeString(TimeHelper.formatDate(TimeHelper.now, 'MMMM DD, YYYY HH:mm')); // trade lock until 

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}