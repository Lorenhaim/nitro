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

                if(action === UnitAction.IDLE)
                {
                    this.client.user.unit.idle(true);

                    return;
                }

                if(this.client.user.unit.canLocate)
                {
                    if(action === UnitAction.BLOW_KISS || action === UnitAction.LAUGH && !this.client.user.details.clubActive) return;

                    this.client.user.unit.location.action(action);
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