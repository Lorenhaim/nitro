import { Unit, UnitType } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitChangeNameComposer extends Outgoing
{
    private _unit: Unit;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.UNIT_CHANGE_NAME);

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(this._unit.id, this._unit.id);

        if(this._unit.type === UnitType.USER) return this.packet.writeString(this._unit.user.details.username).prepare();
        else if(this._unit.type === UnitType.BOT) return this.packet.writeString(this._unit.bot.name).prepare();
        else if(this._unit.type === UnitType.PET) return this.packet.writeString(this._unit.pet.name).prepare();
        else return this.cancel();
    }
}