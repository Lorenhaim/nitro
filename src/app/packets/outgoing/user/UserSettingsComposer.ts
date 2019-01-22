import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserSettingsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_SETTINGS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated) return this.cancel();

            this.packet.writeInt(100); //volume system
            this.packet.writeInt(100); //volume furni
            this.packet.writeInt(100); // volume trax
            this.packet.writeBoolean(false); // old chat
            this.packet.writeBoolean(false); // block room invites
            this.packet.writeBoolean(false); // block (cameara) follow
            this.packet.writeInt(1);
            this.packet.writeInt(0); // chat style

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}