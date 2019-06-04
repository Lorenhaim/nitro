import { RollerData, Unit } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RollingComposer extends Outgoing
{
    private _rollerData: RollerData;
    private _unit: Unit;

    constructor(rollerData: RollerData, unit: Unit = null)
    {
        super(OutgoingHeader.ROLLING);

        if(!(rollerData instanceof RollerData)) throw new Error('invalid_roll');

        this._rollerData    = rollerData;
        this._unit          = unit;
    }

    public compose(): OutgoingPacket
    {
        this.packet
            .writeInt(this._rollerData.position.x)
            .writeInt(this._rollerData.position.y)
            .writeInt(this._rollerData.positionNext.x)
            .writeInt(this._rollerData.positionNext.y);

        const totalItems = this._rollerData.items.length;

        if(totalItems)
        {
            this.packet.writeInt(totalItems);

            for(let i = 0; i < totalItems; i++)
            {
                const item = this._rollerData.items[i];

                this.packet
                    .writeInt(item.id)
                    .writeString(item.rolling.height.toFixed(2))
                    .writeString(item.rolling.nextHeight.toFixed(2));
            }
        }
        else this.packet.writeInt(0);
        
        this.packet.writeInt(this._rollerData.roller.id);

        if(this._unit)
        {
            this.packet
                .writeInt(2) // 1 mv, 2 sld
                .writeInt(this._unit.id)
                .writeString((this._unit.location.rolling.height +  + this._unit.location.additionalHeight).toFixed(2))
                .writeString((this._unit.location.rolling.nextHeight +  + this._unit.location.additionalHeight).toFixed(2));
        }
        
        return this.packet.prepare();
    }
}