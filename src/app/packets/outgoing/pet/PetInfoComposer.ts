import { Pet } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class PetInfoComposer extends Outgoing
{
    private _pet: Pet;

    constructor(pet: Pet)
    {
        super(OutgoingHeader.PET_INFO);

        if(!(pet instanceof Pet)) throw new Error('invalid_pet');

        this._pet = pet;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._pet.id)
                .writeString(this._pet.name)
                .writeInt(this._pet.level, 20) // max
                .writeInt(1) // experience
                .writeInt(1)
                .writeInt(0) // energy
                .writeInt(0) // max energy
                .writeInt(0) // happiness
                .writeInt(100) // max happiness
                .writeInt(0) // respect
                .writeInt(this._pet.userId)
                .writeInt(1) // days old
                .writeString('Bill') // owner
                .writeInt(0) // rarity
                .writeBoolean(true) // has sadle
                .writeBoolean(false) // is being rid
                .writeInt(0)
                .writeInt(0) // anyone rides
                .writeBoolean(false) //can breed / state grown monsterplant
                .writeBoolean(false) // fully grown
                .writeBoolean(false) // is dead
                .writeInt(0) // else monsterplant rarity
                .writeInt(0) // time to live monster
                .writeInt(0) // remaining wellbeing
                .writeInt(0) // remaining grow time
                .writeBoolean(false) // public breed
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}