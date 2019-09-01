import { TradeError } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomTradeErrorComposer extends Outgoing
{
    private _error: TradeError;
    private _username: string;

    constructor(error: TradeError, username: string = null)
    {
        super(OutgoingHeader.TRADE_ERROR);

        this._error     = error || TradeError.TRADING_DISABLED;
        this._username  = username;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._error).writeString(this._username).prepare();
    }
}