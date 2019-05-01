import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomScoreComposer extends Outgoing
{
    private _score: number;
    private _canVote: boolean;

    constructor(score: number, canVote: boolean = false)
    {
        super(OutgoingHeader.ROOM_SCORE);

        this._score     = score || 0;
        this._canVote   = canVote || false;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._score).writeBoolean(this._canVote).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}