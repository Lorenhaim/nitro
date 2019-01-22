import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorMetaDataComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_METADATA, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated) return this.cancel();

            this.packet.writeInt(4);
            this.packet.writeString('official_view');
            this.packet.writeInt(0);
            this.packet.writeString('hotel_view');
            this.packet.writeInt(0);
            this.packet.writeString('roomads_view');
            this.packet.writeInt(0);
            this.packet.writeString('myworld_view');
            this.packet.writeInt(0);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}