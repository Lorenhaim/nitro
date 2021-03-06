import { SocketClient } from '../../../networking';
import { Nitro } from '../../../Nitro';
import { SecurityTicketComposer, UserHomeRoomComposer, UserPermissionsComposer, UserRightsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityLoginEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof SocketClient)
            {

                const userId = await Nitro.gameManager.securityManager.authenticationManager.checkCredentials(this.packet.readString(), this.packet.readString());

                if(!userId) return this.client.processOutgoing(new SecurityTicketComposer(false));
                
                const user = await Nitro.gameManager.userManager.getOfflineUserById(userId);

                if(!user) return this.client.processOutgoing(new SecurityTicketComposer(false));

                if(user.isLoaded)
                {
                    await user.connections.setSocketClient(this.client);

                    this.client.setUser(user);
                }
                else
                {
                    await user.init();

                    await Nitro.gameManager.userManager.addUser(user);

                    await user.connections.setSocketClient(this.client);

                    this.client.setUser(user);
                }
                
                if(this.client.user)
                {
                    if(!this.client.user.details.online) await this.client.user.details.updateOnline(true);

                    const webTicket = await Nitro.gameManager.securityManager.ticketManager.generateWebTicket(this.client.user.id, this.client.ip);

                    this.client.processOutgoing(
                        new SecurityTicketComposer(true, webTicket),
                        new UserHomeRoomComposer(),
                        new UserRightsComposer(),
                        new UserPermissionsComposer());

                    return;
                }
            }
        }

        catch(err)
        {
            if(this.client instanceof SocketClient)
            {
                if(err && err.message === 'invalid_login') this.client.processOutgoing(new SecurityTicketComposer(false));
            }
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}