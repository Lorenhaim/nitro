import { SocketClient } from '../../../networking';
import { Nitro } from '../../../Nitro';
import { SecurityTicketComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityRequestEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof SocketClient)
            {
                const ticketType = this.packet.readString();

                if(ticketType !== null)
                {
                    if(ticketType === 'game')
                    {
                        const ticket = await Nitro.gameManager.securityManager.ticketManager.generateGameTicket(this.client.user.id, this.client.ip);

                        if(ticket !== null) this.client.processOutgoing(new SecurityTicketComposer(true, ticket));
                    }
                }
            }
        }

        catch(err)
        {
            this.client.processOutgoing(new SecurityTicketComposer(false));
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}