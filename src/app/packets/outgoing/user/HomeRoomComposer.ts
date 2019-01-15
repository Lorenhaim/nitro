import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class HomeRoomComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.USER_HOME_ROOM, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeInt(this.user.userInfo ? this.user.userInfo().homeRoom : 0); // room id
            this.packet.writeInt(0);

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}