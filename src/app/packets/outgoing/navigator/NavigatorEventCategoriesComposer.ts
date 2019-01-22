import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorEventCategoriesComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_EVENT_CATEGORIES, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated) return this.cancel();

            this.packet.writeInt(11);
            this.packet.writeInt(1);
            this.packet.writeString('Hottest Events');
            this.packet.writeBoolean(false);
            this.packet.writeInt(2);
            this.packet.writeString('Parties & Music');
            this.packet.writeBoolean(true);
            this.packet.writeInt(3);
            this.packet.writeString('Role Play');
            this.packet.writeBoolean(true);
            this.packet.writeInt(4);
            this.packet.writeString('Help Desk');
            this.packet.writeBoolean(true);
            this.packet.writeInt(5);
            this.packet.writeString('Trading');
            this.packet.writeBoolean(true);
            this.packet.writeInt(6);
            this.packet.writeString('Games');
            this.packet.writeBoolean(true);
            this.packet.writeInt(7);
            this.packet.writeString('Debates & Discussions');
            this.packet.writeBoolean(true);
            this.packet.writeInt(8);
            this.packet.writeString('Grand Openings');
            this.packet.writeBoolean(true);
            this.packet.writeInt(9);
            this.packet.writeString('Friending');
            this.packet.writeBoolean(true);
            this.packet.writeInt(10);
            this.packet.writeString('Jobs');
            this.packet.writeBoolean(true);
            this.packet.writeInt(11);
            this.packet.writeString('Group Events');
            this.packet.writeBoolean(true);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}