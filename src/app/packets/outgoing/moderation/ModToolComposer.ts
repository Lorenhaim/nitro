import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class ModToolComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.MOD_TOOL, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeInt(0); // tickets
            this.packet.writeInt(0); // presets
            this.packet.writeInt(0); // action presets
            this.packet.writeBoolean(true); // tickets
            this.packet.writeBoolean(true); // chatlogs
            this.packet.writeBoolean(true); // user actions
            this.packet.writeBoolean(true); // kick users
            this.packet.writeBoolean(true); // ban users
            this.packet.writeBoolean(true); // room info
            this.packet.writeBoolean(true); // room chatlog
            this.packet.writeInt(0); // room presets

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}