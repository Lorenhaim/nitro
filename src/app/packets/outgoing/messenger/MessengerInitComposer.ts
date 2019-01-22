import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

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
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            this.packet.writeInt(Emulator.config().getNumber('game.user.messenger.maxFriends', 300));
            this.packet.writeInt(Emulator.config().getNumber('game.user.messenger.maxFriends', 300));
            this.packet.writeInt(Emulator.config().getNumber('game.user.messenger.maxFriends.habboClub', 500));
            this.packet.writeInt(0); // categories

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}