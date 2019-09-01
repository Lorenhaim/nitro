import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeConfirmComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.TRADE_CONFIRM);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}