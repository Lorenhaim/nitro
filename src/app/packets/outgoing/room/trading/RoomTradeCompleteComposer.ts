import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeCompleteComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.TRADE_COMPLETE);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}