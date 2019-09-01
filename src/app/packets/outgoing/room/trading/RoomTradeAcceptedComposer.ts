import { TradeUser } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeAcceptedComposer extends Outgoing
{
    private _trader: TradeUser;

    constructor(trader: TradeUser)
    {
        super(OutgoingHeader.TRADE_ACCEPTED);

        if(!(trader instanceof TradeUser)) throw new Error('invalid_trader');

        this._trader = trader;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._trader.user.id).writeInt(this._trader.didAccept ? 1 : 0).prepare();
    }
}