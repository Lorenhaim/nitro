import { TradeSession } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeComposer extends Outgoing
{
    private _trade: TradeSession;

    constructor(trade: TradeSession)
    {
        super(OutgoingHeader.TRADE);

        if(!(trade instanceof TradeSession)) throw new Error('invalid_trade');

        this._trade = trade;
    }

    public compose(): OutgoingPacket
    {
        const totalTraders = this._trade.traders.length;

        if(!totalTraders) return this.cancel();

        for(let i = 0; i < totalTraders; i++) this.packet.writeInt(this._trade.traders[i].user.id, 1);

        return this.packet.prepare();
    }
}