import { Emulator } from '../../../Emulator';
import { PermissionList } from '../../../game';
import { GameClient, SocketClient } from '../../../networking';
import { CfhTopicsComposer, ClothingComposer, EffectsComposer, ModToolComposer, Outgoing, SecurityTicketComposer, SecurityUnknown2Composer, SecurityUnknownComposer, SecurtiyDebugComposer, UserAchievementScoreComposer, UserBuildersClubComposer, UserClubComposer, UserFavoriteRoomCountComposer, UserFirstLoginOfDayComposer, UserHomeRoomComposer, UserItemsRefreshComposer, UserPermissionsComposer, UserRightsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityTicketEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof GameClient)
            {
                const userId = await Emulator.gameManager.securityManager.ticketManager.checkGameTicket(this.packet.readString(), this.client.ip);

                if(!userId) return await this.client.dispose();
                
                const user = await Emulator.gameManager.userManager.getOfflineUserById(userId);

                if(!user) return await this.client.dispose();

                if(user.isLoaded)
                {
                    await user.connections.setGameClient(this.client);

                    this.client.setUser(user);
                }
                else
                {
                    await user.init();

                    await Emulator.gameManager.userManager.addUser(user);

                    await user.connections.setGameClient(this.client);

                    this.client.setUser(user);
                }
                
                if(this.client.user)
                {
                    if(!this.client.user.details.online) await this.client.user.details.updateOnline(true);

                    const pendingComposers: Outgoing[] = [];

                    pendingComposers.push(
                        new SecurityTicketComposer(true),
                        new UserHomeRoomComposer(),
                        new UserRightsComposer(),
                        new UserPermissionsComposer(),
                        new UserFirstLoginOfDayComposer(),
                        new UserAchievementScoreComposer(),
                        new UserBuildersClubComposer(),
                        new UserItemsRefreshComposer(),
                        new EffectsComposer(),
                        new ClothingComposer(),
                        new SecurityUnknownComposer(),
                        new SecurityUnknown2Composer(),
                        new UserClubComposer(),
                        new CfhTopicsComposer(),
                        new UserFavoriteRoomCountComposer()
                    );
                    
                    if(this.client.user.rank && this.client.user.rank.permission)
                    {
                        if(this.client.user.rank.permission.hasPermission(PermissionList.MOD_TOOL)) pendingComposers.push(new ModToolComposer());

                        pendingComposers.push(new SecurtiyDebugComposer(true));
                    }

                    if(pendingComposers.length) this.client.processOutgoing(...pendingComposers);

                    return;
                }
            }

            else if(this.client instanceof SocketClient)
            {
                if(Emulator.config.captcha.enabled) await Emulator.gameManager.securityManager.authenticationManager.validateCaptcha(this.packet.readString(), this.client.ip);
                    
                const userId = await Emulator.gameManager.securityManager.ticketManager.checkWebTicket(this.packet.readString(), this.client.ip);

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

                    this.client.processOutgoing(new SecurityTicketComposer(true));

                    return;
                }
            }
        }

        catch(err)
        {
            this.client.processOutgoing(new SecurityTicketComposer(false));

            if(this.client instanceof GameClient) await this.client.dispose();
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}