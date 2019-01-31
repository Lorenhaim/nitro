import { User } from '../game';

import { Incoming, IncomingHeader, IncomingPacket } from './incoming';

import * as IncomingClient from './incoming/client';
import * as IncomingGames from './incoming/games';
import * as IncomingSecurity from './incoming/security';
import * as IncomingHotelView from './incoming/hotelview';
import * as IncomingNavigator from './incoming/navigator';
import * as IncomingUser from './incoming/user';

export class PacketManager
{
    private _incomingHandlers: { header: IncomingHeader, handler: Incoming }[];

    constructor()
    {
        this._incomingHandlers = [];

        this.registerClient();
        this.registerGames();
        this.registerSecurity();
        this.registerHotelView();
        this.registerNavigator();
        this.registerMessenger();
        this.registerUser();
    }

    public addHandler(header: IncomingHeader, handler: any): boolean
    {
        if(!(handler.prototype instanceof Incoming)) return false;
        
        const totalHandlers = this._incomingHandlers.length;

        let result = false;

        for(let i = 0; i < totalHandlers; i++)
        {
            const handle = this._incomingHandlers[i];

            if(handle.header === header)
            {
                this._incomingHandlers.splice(i, 1);

                this._incomingHandlers.push({
                    header: handle.header,
                    handler: handle.handler
                });

                result = true;
            }
        }

        if(!result) this._incomingHandlers.push({ header, handler });
        
        return true;
    }

    private registerClient(): void
    {
        this.addHandler(IncomingHeader.CLIENT_LATENCY, IncomingClient.ClientLatencyEvent);
        this.addHandler(IncomingHeader.CLIENT_PING, IncomingClient.ClientPingEvent);
        this.addHandler(IncomingHeader.RELEASE_VERSION, IncomingClient.ClientReleaseVersionEvent);
        this.addHandler(IncomingHeader.CLIENT_VARIABLES, IncomingClient.ClientVariablesEvent);
        this.addHandler(IncomingHeader.CROSS_DOMAIN, IncomingClient.ClientPolicyEvent);
        this.addHandler(IncomingHeader.EVENT_TRACKER, IncomingClient.ClientEventTrackerEvent);
    }

    private registerGames(): void
    {
        this.addHandler(IncomingHeader.GAMES_INIT, IncomingGames.GamesInitEvent);
        this.addHandler(IncomingHeader.GAMES_LIST, IncomingGames.GamesListEvent);
    }

    private registerSecurity(): void
    {
        this.addHandler(IncomingHeader.MACHINE_ID, IncomingSecurity.SecurityMachineIdEvent);
        this.addHandler(IncomingHeader.SECURITY_TICKET, IncomingSecurity.SecurityTicketEvent);
    }

    private registerHotelView(): void
    {
        this.addHandler(IncomingHeader.HOTELVIEW_CAMPAIGNS, IncomingHotelView.HotelViewCampaignsEvent);
        this.addHandler(IncomingHeader.HOTELVIEW_NEWS, IncomingHotelView.HotelViewNewsEvent);
        this.addHandler(IncomingHeader.HOTELVIEW_VISIT, IncomingHotelView.HotelViewVisitEvent);
    }
    
    private registerNavigator(): void
    {
        this.addHandler(IncomingHeader.NAVIGATOR_CATEGORIES, IncomingNavigator.NavigatorCategoriesEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_INIT, IncomingNavigator.NavigatorInitEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_ROOMS, IncomingNavigator.NavigatorRoomsEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SETTINGS, IncomingNavigator.NavigatorSettingsEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SETTINGS_SAVE, IncomingNavigator.NavigatorSettingsSaveEvent);
    }

    private registerMessenger(): void
    {
        this.addHandler(IncomingHeader.MESSENGER_ACCEPT, IncomingUser.MessengerAcceptEvent);
        this.addHandler(IncomingHeader.MESSENGER_CHAT, IncomingUser.MessengerChatEvent);
        this.addHandler(IncomingHeader.MESSENGER_DECLINE, IncomingUser.MessengerDeclineEvent);
        this.addHandler(IncomingHeader.MESSENGER_FRIENDS, IncomingUser.MessengerFriendsEvent);
        this.addHandler(IncomingHeader.MESSENGER_INIT, IncomingUser.MessengerInitEvent);
        this.addHandler(IncomingHeader.MESSENGER_RELATIONSHIPS, IncomingUser.MessengerRelationshipsEvent);
        this.addHandler(IncomingHeader.MESSENGER_REMOVE, IncomingUser.MessengerRemoveEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUEST, IncomingUser.MessengerRequestEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUESTS, IncomingUser.MessengerRequestsEvent);
        this.addHandler(IncomingHeader.MESSENGER_SEARCH, IncomingUser.MessengerSearchEvent);
        this.addHandler(IncomingHeader.MESSENGER_RELATIONSHIPS_UPDATE, IncomingUser.MessengerRelationshipUpdateEvent);
        this.addHandler(IncomingHeader.MESSENGER_UPDATES, IncomingUser.MessengerUpdatesEvent);
    }

    private registerUser(): void
    {
        this.addHandler(IncomingHeader.USER_BADGES, IncomingUser.BadgesEvent);
        this.addHandler(IncomingHeader.USER_BADGES_CURRENT, IncomingUser.BadgesCurrentEvent);
        this.addHandler(IncomingHeader.USER_BADGES_CURRENT_UPDATE, IncomingUser.BadgesCurrentUpdateEvent);

        this.addHandler(IncomingHeader.USER_CLUB, IncomingUser.UserClubEvent);
        this.addHandler(IncomingHeader.USER_CURRENCY, IncomingUser.UserCurrencyEvent);
        this.addHandler(IncomingHeader.USER_FIGURE, IncomingUser.UserFigureEvent);
        this.addHandler(IncomingHeader.USER_IGNORED, IncomingUser.UserIgnoredEvent);
        this.addHandler(IncomingHeader.USER_INFO, IncomingUser.UserInfoEvent);
        this.addHandler(IncomingHeader.USER_ONLINE, IncomingUser.UserOnlineEvent);
        this.addHandler(IncomingHeader.USER_PROFILE, IncomingUser.UserProfileEvent);
        this.addHandler(IncomingHeader.USER_SETTINGS, IncomingUser.UserSettingsEvent);
    }

    public async processPacket(user: User, packet: IncomingPacket)
    {
        if(!packet.header) return Promise.resolve(true);

        let packetHandler: Incoming = null;

        const totalHandlers = this._incomingHandlers.length;

        for(let i = 0; i < totalHandlers; i++)
        {
            const handle = this._incomingHandlers[i];

            if(handle.header === packet.header)
            {
                let getHandler: any     = handle.handler;
                let handler: Incoming   = new getHandler();

                if(!(handler instanceof Incoming)) break;

                handler.user    = user;
                handler.packet  = packet;

                packetHandler = handler;
            }
        }

        if(!packetHandler)
        {
            console.log(`Unhandled -> ${ packet.header }`);
            return Promise.resolve(true);
        }

        await packetHandler.process();
        console.log(`Handled -> ${ packet.header }`);

        return Promise.resolve(true);
    }
}