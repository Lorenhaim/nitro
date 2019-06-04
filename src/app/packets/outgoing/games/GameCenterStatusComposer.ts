import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GameCenterStatusComposer extends Outgoing
{
    private _id: number;
    private _remaining: number;

    constructor(id: number, remaining: number)
    {
        super(OutgoingHeader.GAME_CENTER_STATUS);

        this._id        = id;
        this._remaining = remaining;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._id, this._remaining, 1).prepare();
    }
}