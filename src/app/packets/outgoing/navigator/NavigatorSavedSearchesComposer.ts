import { Emulator } from '../../../Emulator';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorSavedSearchesComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_SEARCHES);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded)
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

                return this.packet.prepare();
            }

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}