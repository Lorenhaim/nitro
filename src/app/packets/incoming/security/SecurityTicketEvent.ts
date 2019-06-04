import { Emulator } from '../../../Emulator';
import { PermissionList } from '../../../game';
import { GameClient, SocketClient } from '../../../networking';
import { GameCenterGameListComposer, GameCenterStatusComposer, ModerationToolComposer, ModerationTopicsComposer, Outgoing, SecurityPingComposer, SecurityTicketComposer, SecurityUnknown2Composer, SecurtiyDebugComposer, UserAchievementScoreComposer, UserBuildersClubComposer, UserClothingComposer, UserClubComposer, UserEffectsComposer, UserFavoriteRoomCountComposer, UserFirstLoginOfDayComposer, UserHomeRoomComposer, UserItemsRefreshComposer, UserPermissionsComposer, UserRightsComposer } from '../../outgoing';
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
                }
                else
                {
                    await user.connections.setGameClient(this.client);

                    await user.init();

                    await Emulator.gameManager.userManager.addUser(user);
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
                        new UserEffectsComposer(),
                        new UserClothingComposer(),
                        new SecurityPingComposer(),
                        new SecurityUnknown2Composer(),
                        new UserClubComposer(),
                        new ModerationTopicsComposer(),
                        new UserFavoriteRoomCountComposer(),
                        new GameCenterGameListComposer(),
                        new GameCenterStatusComposer(3, 100),
                        new GameCenterStatusComposer(0, 100)
                    );
                    
                    if(this.client.user.rank && this.client.user.rank.permission)
                    {
                        if(this.client.user.hasPermission(PermissionList.MOD_TOOL)) pendingComposers.push(new ModerationToolComposer());

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

                if(!userId) return this.client.processOutgoing(new SecurityTicketComposer(false));
                
                const user = await Emulator.gameManager.userManager.getOfflineUserById(userId);

                if(!user) return this.client.processOutgoing(new SecurityTicketComposer(false));

                if(user.isLoaded)
                {
                    await user.connections.setSocketClient(this.client);
                }
                else
                {
                    await user.connections.setSocketClient(this.client);
                    
                    await user.init();

                    await Emulator.gameManager.userManager.addUser(user);
                }
                
                if(this.client.user)
                {
                    if(!this.client.user.details.online) await this.client.user.details.updateOnline(true);

                    return this.client.processOutgoing(new SecurityTicketComposer(true));
                }
            }
        }

        catch(err)
        {
            if(this.client instanceof GameClient) await this.client.dispose();
            else this.client.processOutgoing(new SecurityTicketComposer(false));
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}