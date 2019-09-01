import { TradeSession } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeUpdateComposer extends Outgoing
{
    private _trade: TradeSession;

    constructor(trade: TradeSession)
    {
        super(OutgoingHeader.TRADE_UPDATE);

        if(!(trade instanceof TradeSession)) throw new Error('invalid_trade');

        this._trade = trade;
    }

    public compose(): OutgoingPacket
    {
        const totalTraders = this._trade.traders.length;

        if(!totalTraders) return this.packet.writeInt(0, 0).prepare();

        for(let i = 0; i < totalTraders; i++)
        {
            const trader = this._trade.traders[i];

            if(!trader) continue;

            this.packet.writeInt(trader.user.id);

            const totalItems = trader.items.length;

            if(totalItems)
            {
                this.packet.writeInt(totalItems);

                for(let j = 0; j < totalItems; j++)
                {
                    const item = trader.items[j];

                    if(!item) continue;

                    item.parseTradeData(this.packet);
                }
            }
            else this.packet.writeInt(0);

            this.packet.writeInt(0, 0);
        }

        return this.packet.prepare();
    }
}