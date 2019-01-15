import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class MessengerInitComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.MESSENGER_INIT, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeInt(300); // max friends
            this.packet.writeInt(1337); // max friends
            this.packet.writeInt(10000); // max friends
            this.packet.writeInt(0); // categories

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}