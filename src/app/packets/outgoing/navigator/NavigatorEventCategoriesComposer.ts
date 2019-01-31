import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorEventCategoriesComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_EVENT_CATEGORIES, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                const totalEventCategories = Emulator.gameManager().navigatorManager().eventCategories.length;

                if(totalEventCategories)
                {
                    this.packet.writeInt(totalEventCategories);

                    for(let i = 0; i < totalEventCategories; i++)
                    {
                        const category = Emulator.gameManager().navigatorManager().categories[i];

                        this.packet.writeInt(category.id);
                        this.packet.writeString(category.name);
                        this.packet.writeBoolean(true); // ??
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