import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorSearchComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_SEARCH, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated) return this.cancel(); // check perm

            this.packet.writeString(''); //search code
            this.packet.writeString(''); //search query
            this.packet.writeInt(0); // total results

            //foreach
            //this.packet.writeString(''); // code
            //this.packet.writeString(''); // query
            //this.packet.writeInt(0); // action type
            //this.packet.writeBoolean(false); // if collapsed
            //this.packet.writeInt(0); // mode type

            // with results of rooms
            // this.packet.writeInt(0); // total rooms

            //foreach

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}