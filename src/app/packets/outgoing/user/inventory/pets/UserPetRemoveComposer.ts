import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserPetRemoveComposer extends Outgoing
{
    private _id: number;

    constructor(id: number)
    {
        super(OutgoingHeader.USER_PET_REMOVE);

        if(!id) throw new Error('invalid_pet_id');

        this._id = id;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._id).prepare();
    }
}