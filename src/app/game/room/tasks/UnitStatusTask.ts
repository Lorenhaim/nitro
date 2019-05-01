import { Unit } from '../../unit';
import { Room } from '../Room';
import { Task } from './Task';

export class UnitStatusTask extends Task
{
    private _room: Room;

    constructor(room: Room)
    {
        super('UnitStatus');

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    protected async onRun(): Promise<void>
    {
        const currentUnits = this._room.unitManager.units;

        if(currentUnits)
        {
            const totalUnits = currentUnits.length;

            if(totalUnits) for(let i = 0; i < totalUnits; i++) this.processUnit(currentUnits[i]);
        }
    }

    private processUnit(unit: Unit): void
    {
        if(unit)
        {
            const statuses = unit.location.statuses;

            if(statuses)
            {
                const totalStatuses = statuses.length;

                if(totalStatuses)
                {
                    for(let i = 0; i < totalStatuses; i++)
                    {
                        const status = statuses[i];

                        if(status.actionSwapCountdown > 0)
                        {
                            status.actionSwapCountdown -= 1;
                        }

                        else if(status.actionSwapCountdown === 0)
                        {
                            status.actionSwapCountdown = -1;

                            status.swapKeys();

                            unit.needsUpdate = true;
                        }

                        if(status.actionCountdown > 0)
                        {
                            status.actionCountdown -= 1;
                        }

                        else if(status.actionCountdown === 0)
                        {
                            status.actionCountdown = -1;

                            status.swapKeys();

                            unit.needsUpdate = true;
                        }

                        if(status.lifetimeCountdown > 0)
                        {
                            status.lifetimeCountdown -= 1;
                        }

                        else if(status.lifetimeCountdown === 0)
                        {
                            status.lifetimeCountdown = -1;
                            
                            //unit.location.removeStatus(status.key);

                            unit.needsUpdate = true;
                        }
                    }
                }
            }
        }
    }
}