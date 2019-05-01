import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ModToolComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MOD_TOOL);
    }

    public compose(): OutgoingPacket
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

            return this.packet;
        }

        catch(err)
        {
            this.error(err);
        }
    }
}