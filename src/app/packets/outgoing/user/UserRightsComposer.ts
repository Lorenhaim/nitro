import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class UserRightsComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.USER_RIGHTS, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeInt(2); // club level
            this.packet.writeInt(this.user.rankId); // rank id
            this.packet.writeBoolean(false); //is ambassador

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}