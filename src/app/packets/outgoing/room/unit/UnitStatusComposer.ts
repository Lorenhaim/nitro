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

        this._units = [ ...units ];
    }

    public compose(): OutgoingPacket
    {
        const totalUnits = this._units.length;

        if(!totalUnits) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalUnits);

        for(let i = 0; i < totalUnits; i++)
        {
            const unit = this._units[i];
            
            this.packet
                .writeInt(unit.id)
                .writeInt(unit.location.position.x)
                .writeInt(unit.location.position.y)
                .writeString((unit.location.position.z + unit.location.additionalHeight).toFixed(2))
                .writeInt(unit.location.position.headDirection)
                .writeInt(unit.location.position.direction);
                    
            let actions = '/';

            const statuses = unit.location.statuses;

            if(!statuses)
            {
                this.packet.writeString(actions);

                continue;
            }

            const totalStatuses = statuses.length;

            if(!totalStatuses)
            {
                this.packet.writeString(actions);

                continue;
            }
            
            for(let i = 0; i < totalStatuses; i++)
            {
                const status = statuses[i];

                if(!status) continue;

                if(!status.key) continue;
                
                actions += `${ status.key }`
                
                if(status.value) actions += ` ${ status.value }`;
                
                actions += '/';

                if(status.key === UnitStatusType.SIGN) unit.location.statuses.splice(i, 1);
            }
                
            this.packet.writeString(actions);
        }
        
        return this.packet.prepare();
    }
}