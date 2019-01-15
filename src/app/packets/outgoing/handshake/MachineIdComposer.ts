import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class MachineIdComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.MACHINE_ID, user);

        if(this.user.isAuthenticated) throw new Error('already_authenticated');

        if(!this.user._machineId) throw new Error('invalid_machine_id');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeString(this.user._machineId);

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}