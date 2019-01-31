import { Emulator } from '../../../../Emulator';
import { Logger } from '../../../../common';
import { User } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerInitComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.MESSENGER_INIT, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.messenger() && this.user.messenger().isLoaded)
            {
                this.packet.writeInt(Emulator.config().getNumber('game.user.messenger.maxFriends', 300));
                this.packet.writeInt(0);
                this.packet.writeInt(Emulator.config().getNumber('game.user.messenger.maxFriends.habboClub', 500));

                const totalCategories = this.user.messenger().categories.length;

                if(totalCategories)
                {
                    this.packet.writeInt(totalCategories);

                    for(let i = 0; i < totalCategories; i++)
                    {
                        const category = this.user.messenger().categories[i];

                        this.packet.writeInt(category.id);
                        this.packet.writeString(category.name);
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