import { TradeClosed } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeClosedComposer extends Outgoing
{
    private _userId: number;
    private _error: TradeClosed;

    constructor(userId: number, error: TradeClosed)
    {
        super(OutgoingHeader.TRADE_CLOSED);

        this._userId    = userId || 0;
        this._error     = error || TradeClosed.USER_CANCEL_TRADE;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._userId).writeInt(this._error).prepare();
    }
}