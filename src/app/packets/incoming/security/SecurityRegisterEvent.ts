import { SocketClient } from '../../../networking';
import { Nitro } from '../../../Nitro';
import { SecurityRegisterComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityRegisterEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof SocketClient)
            {
                const userId = await Nitro.gameManager.securityManager.authenticationManager.registerUser(this.packet.readString(), this.packet.readString(), this.packet.readString(), this.packet.readString(), this.client.ip);

                if(userId)
                {
                    const webTicket = await Nitro.gameManager.securityManager.ticketManager.generateWebTicket(userId, this.client.ip);

                    this.client.processOutgoing(new SecurityRegisterComposer(true, webTicket));
                }
            }
        }

        catch(err)
        {
            this.client.processOutgoing(new SecurityRegisterComposer(false));
            
            this.error(err);
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}