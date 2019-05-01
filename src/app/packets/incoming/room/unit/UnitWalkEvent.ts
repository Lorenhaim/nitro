import { Position } from '../../../../game/pathfinder';
import { Incoming } from '../../Incoming';

export class UnitWalkEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom)
            {
                if(this.client.user.unit.canLocate)
                {
                    this.client.user.unit.location.walkTo(new Position(this.packet.readInt(), this.packet.readInt()), true);
                }
                else
                {
                    if(this.client.user.unit.isIdle) this.client.user.unit.timer.resetIdleTimer();
                }
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}