import { Emulator } from '../../../Emulator';
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
        const publicItems: { key: string, value: string }[] = [];

        const publicKeys = ['general', 'client'];

        for(let parentKey in Emulator.config)
        {
            if(!parentKey) continue;

            if(publicKeys.indexOf(parentKey) === -1) continue;

            const items = Emulator.config[parentKey];

            if(!items) continue;

            for(let childKey in items)
            {
                if(!childKey) continue;

                const value = items[childKey];

                if(!value) continue;

                if(typeof value === 'object')
                {
                    const items = Emulator.config[parentKey][childKey];

                    if(!items) continue;

                    for(let grandChildKey in items)
                    {
                        if(!grandChildKey) continue;

                        const value = items[grandChildKey];

                        if(!value || typeof value === 'object') continue;

                        publicItems.push({ key: `${ parentKey }.${ childKey }.${ grandChildKey }`, value });
                    }
                }
                else
                {
                    publicItems.push({ key: `${ parentKey }.${ childKey }`, value });
                }
            }
        }
        
        const totalItems = publicItems.length;

        if(totalItems)
        {
            this.packet.writeInt(totalItems);

            for(let i = 0; i < totalItems; i++)
            {
                const item = publicItems[i];

                if(!item) continue;

                this.packet.writeString(item.key, item.value.toString());
            }
        }

        return this.packet.prepare();
    }
}