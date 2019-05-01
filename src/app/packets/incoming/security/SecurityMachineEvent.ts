import { GameClient } from '../../../networking';
import { SecurityMachineComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityMachineEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof GameClient)
            {
                const unknown1      = this.packet.readString();
                const machineId     = this.packet.readString();
                const flashVersion  = this.packet.readString();

                this.client.machineId = machineId;

                this.client.processOutgoing(new SecurityMachineComposer());
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}