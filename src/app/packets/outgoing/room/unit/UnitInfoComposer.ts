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
        if(this._unit.type === UnitType.USER)
        {
            return this.packet
                .writeInt(this._unit.id)
                .writeString(this._unit.user.details.figure)
                .writeString(this._unit.user.details.gender)
                .writeString(this._unit.user.details.motto)
                .writeInt(this._unit.user.details.achievementScore)
                .prepare();
        }
            
        else if(this._unit.type === UnitType.BOT)
        {
            return this.packet
                .writeInt(this._unit.id)
                .writeString(this._unit.bot.figure)
                .writeString(this._unit.bot.gender)
                .writeString(this._unit.bot.motto)
                .writeInt(0)
                .prepare();
        }
        
        return this.cancel();
    }
}