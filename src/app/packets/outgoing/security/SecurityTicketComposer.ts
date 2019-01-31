import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityTicketComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.SECURITY_TICKET_OK, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            this.packet.writeBoolean(this.user.isAuthenticated)

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}