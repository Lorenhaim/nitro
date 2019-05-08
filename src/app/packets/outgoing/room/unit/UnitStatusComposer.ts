import { Unit, UnitStatusType } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitStatusComposer extends Outgoing
{
    private _units: Unit[];

    constructor(...units: Unit[])
    {
        super(OutgoingHeader.UNIT_STATUS);

        let someUnits: Unit[]   = [];
        this._units             = someUnits.concat(units);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this._units !== null)
            {
                const totalUnits = this._units.length;

                if(totalUnits > 0)
                {
                    this.packet.writeInt(totalUnits);

                    for(let i = 0; i < totalUnits; i++)
                    {
                        const unit = this._units[i];

                        if(!unit) continue;
                        
                        this.packet
                            .writeInt(unit.id)
                            .writeInt(unit.location.position.x)
                            .writeInt(unit.location.position.y)
                            .writeString((unit.location.position.z + unit.location.additionalHeight).toFixed(2))
                            .writeInt(unit.location.position.headDirection)
                            .writeInt(unit.location.position.direction);
                                
                        let actions = '/';

                        const statuses = unit.location.statuses;

                        if(statuses !== null)
                        {
                            const totalStatuses = statuses.length;

                            if(totalStatuses > 0)
                            {
                                for(let i = 0; i < totalStatuses; i++)
                                {
                                    const status = statuses[i];

                                    if(status !== undefined)
                                    {
                                        if(status.key !== null)
                                        {
                                            actions += `${ status.key }`

                                            if(status.value) actions += ` ${ status.value }`;
                                        }

                                        actions += '/';

                                        if(status.key === UnitStatusType.SIGN) unit.location.statuses.splice(i, 1);
                                    }
                                }
                            }
                        }
                            
                        this.packet.writeString(actions);
                    }

                    return this.packet.prepare();
                }
            }

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}