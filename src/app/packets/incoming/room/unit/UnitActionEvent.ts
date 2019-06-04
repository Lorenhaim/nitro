import { UnitAction } from '../../../../game';
import { Incoming } from '../../Incoming';

export class UnitActionEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom)
            {
                const action: UnitAction = this.packet.readInt();

                if(action === UnitAction.IDLE) return this.client.user.unit.idle(true);

                if(this.client.user.unit.canLocate) return this.client.user.unit.location.action(action);
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