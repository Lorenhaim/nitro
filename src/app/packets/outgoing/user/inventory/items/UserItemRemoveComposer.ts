import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserItemRemoveComposer extends Outgoing
{
    private _id: number;

    constructor(id: number)
    {
        super(OutgoingHeader.USER_ITEM_REMOVE);

        if(!id) throw new Error('invalid_item_id');

        this._id = id;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._id).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}