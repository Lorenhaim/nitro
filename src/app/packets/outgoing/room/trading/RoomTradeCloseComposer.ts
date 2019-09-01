import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeCloseComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.TRADE_CLOSE);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}