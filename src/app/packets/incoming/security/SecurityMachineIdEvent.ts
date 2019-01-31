import { Logger } from '../../../common';

import { SecurityMachineIdComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class SecurityMachineIdEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MACHINE_ID) throw new Error('invalid_header');

            if(!this.user.isAuthenticated)
            {
                const unknown1      = this.packet.readString();
                const machineId     = this.packet.readString();
                const flashVersion  = this.packet.readString();

                this.user.client().machineId = machineId;

                await this.user.client().processComposer(new SecurityMachineIdComposer(this.user));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}