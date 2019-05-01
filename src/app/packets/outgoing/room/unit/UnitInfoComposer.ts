import { Unit, UnitType } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitInfoComposer extends Outgoing
{
    private _unit: Unit;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.UNIT_INFO);

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this._unit.type === UnitType.USER)
            {
                return this.packet
                    .writeInt(this._unit.id)
                    .writeString(this._unit.user.details.figure)
                    .writeString(this._unit.user.details.gender.toString())
                    .writeString(this._unit.user.details.motto)
                    .writeInt(this._unit.user.details.achievementScore)
                    .prepare();
            }

            return this.packet.writeInt(-1).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}