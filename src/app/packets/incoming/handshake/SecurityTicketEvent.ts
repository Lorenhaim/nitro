import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { SecurityTicketComposer, HomeRoomComposer, UserRightsComposer, ModToolComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class SecurityTicketEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.SECURITY_TICKET) throw new Error('invalid_header');

            const securityTicket = this.packet.readString();

            if(!securityTicket) throw new Error('invalid_ticket');

            await this.user.checkTicket(securityTicket);

            if(!this.user.userId) throw new Error('invalid_authentication');

            await Emulator.gameManager().userManager().addUser(this.user);

            await this.user.loadUser();

            if(!this.user.isAuthenticated) throw new Error('invalid_authentication');

            await this.user.client().processComposer(new SecurityTicketComposer(this.user));
            await this.user.client().processComposer(new HomeRoomComposer(this.user));
            await this.user.client().processComposer(new UserRightsComposer(this.user));

            await this.user.client().processComposer(new ModToolComposer(this.user));

            await this.user.setOnline(true);

            return true;
        }

        catch(err)
        {
            await this.user.dispose();

            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}