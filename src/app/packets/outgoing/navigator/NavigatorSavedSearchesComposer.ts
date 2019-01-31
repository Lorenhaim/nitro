import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorSavedSearchesComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_SEARCHES, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                this.packet.writeInt(4);
                this.packet.writeInt(1);
                this.packet.writeString('official');
                this.packet.writeString('');
                this.packet.writeString('');
                this.packet.writeInt(2);
                this.packet.writeString('recommended');
                this.packet.writeString('');
                this.packet.writeString('');
                this.packet.writeInt(3);
                this.packet.writeString('my');
                this.packet.writeString('');
                this.packet.writeString('');
                this.packet.writeInt(4);
                this.packet.writeString('favorites');
                this.packet.writeString('');
                this.packet.writeString('');

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