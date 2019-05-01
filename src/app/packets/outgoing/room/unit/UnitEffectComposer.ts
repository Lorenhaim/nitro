import { Unit } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitEffectComposer extends Outgoing
{
    private _unit: Unit;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.UNIT_EFFECT);

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._unit.id, this._unit.location.effectType || 0, 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}