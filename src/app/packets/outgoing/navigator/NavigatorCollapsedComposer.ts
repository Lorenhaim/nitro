import { Emulator } from '../../../Emulator';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorCollapsedComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_COLLAPSED);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded) return this.packet.writeInt(0).prepare();

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}