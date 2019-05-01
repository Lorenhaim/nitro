import { Emulator } from '../../../Emulator';
import { SocketClient } from '../../../networking';
import { SecurityTicketComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityLoginEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof SocketClient)
            {
                // if(Emulator.config.getBoolean('captcha.enabled', false))
                // {
                //     if(!Emulator.gameManager.securityManager.authenticationManager.validateCaptcha(this.packet.readString(), this.client.ip))
                // }

                const userId = await Emulator.gameManager.securityManager.authenticationManager.checkCredentials(this.packet.readString(), this.packet.readString());

                if(!userId) return;
                
                const user = await Emulator.gameManager.userManager.getOfflineUserById(userId);

                if(!user) return;

                if(user.isLoaded)
                {
                    await user.connections.setSocketClient(this.client);

                    this.client.setUser(user);
                }
                else
                {
                    await user.init();

                    await Emulator.gameManager.userManager.addUser(user);

                    await user.connections.setSocketClient(this.client);

                    this.client.setUser(user);
                }
                
                if(this.client.user)
                {
                    if(!this.client.user.details.online) await this.client.user.details.updateOnline(true);

                    const webTicket = await Emulator.gameManager.securityManager.ticketManager.generateWebTicket(this.client.user.id, this.client.ip);

                    this.client.processOutgoing(new SecurityTicketComposer(true, webTicket));

                    return;
                }
            }
        }

        catch(err)
        {
            if(this.client instanceof SocketClient)
            {
                if(err && err.message === 'invalid_login') this.client.processOutgoing(new SecurityTicketComposer(false));
                if(err && err.message === 'invalid_captcha') this.client.processOutgoing(new SecurityTicketComposer(false));
            }
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}