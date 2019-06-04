import { Pet } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserPetAddComposer extends Outgoing
{
    private _pet: Pet;

    constructor(pet: Pet)
    {
        super(OutgoingHeader.USER_PET_ADD);

        if(!pet) throw new Error('invalid_pet');

        this._pet = pet;
    }

    public compose(): OutgoingPacket
    {
        this._pet.parseInventoryData(this.packet);

        return this.packet.writeBoolean(false).prepare();
    }
}