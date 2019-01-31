import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorMetaDataComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_METADATA, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                const totalTabs = Emulator.gameManager().navigatorManager().tabs.length;

                if(totalTabs)
                {
                    this.packet.writeInt(totalTabs);

                    for(let i = 0; i < totalTabs; i++)
                    {
                        const tab = Emulator.gameManager().navigatorManager().tabs[i];

                        this.packet.writeString(tab.name);
                        this.packet.writeInt(0); // ??
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                }

                this.packet.prepare();

                return this.packet;
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}