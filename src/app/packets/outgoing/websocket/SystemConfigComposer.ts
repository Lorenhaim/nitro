import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SystemConfigComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.SYSTEM_CONFIG);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            // const totalItems = Emulator.config.publicConfig.length;

            // if(totalItems)
            // {
            //     this.packet.writeInt(totalItems);

            //     for(let i = 0; i < totalItems; i++)
            //     {
            //         const item = Emulator.config.publicConfig[i];

            //         this.packet.writeString(item.key);
            //         this.packet.writeString(item.value);
            //     }
            // }

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}