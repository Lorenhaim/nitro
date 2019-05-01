import { UnitTypingComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class UnitTypingStopEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom !== null) currentRoom.unitManager.processOutgoing(new UnitTypingComposer(this.client.user.unit.id, false));
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