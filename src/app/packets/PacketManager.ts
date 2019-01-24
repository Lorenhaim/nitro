import { User } from '../game';

import { Incoming, IncomingHeader, IncomingPacket } from './incoming';
import { ClientLatencyEvent, ClientPingEvent, ClientReleaseVersionEvent, ClientVariablesEvent, CrossDomainEvent, EventTrackerEvent } from './incoming/client';
import { GamesInitEvent, GetGamesEvent } from './incoming/games';
import { MachineIdEvent, SecurityTicketEvent } from './incoming/handshake';
import { GetArticlesEvent, GetCampaignsEvent } from './incoming/hotelview';
import { MessengerAcceptEvent, MessengerChatEvent, MessengerFriendsEvent, MessengerInitEvent, MessengerRemoveEvent, MessengerRequestEvent, MessengerRequestsEvent, MessengerSearchEvent } from './incoming/messenger';
import { NavigatorInitEvent, NavigatorRoomsEvent, NavigatorSettingsEvent } from './incoming/navigator';
import { UserClubEvent, UserCreditsEvent, UserCurrentBadgesEvent, UserFigureEvent, UserIgnoredEvent, UserInfoEvent, UserOnlineEvent, UserProfileEvent, UserRelationshipsEvent, UserSanctionStatusEvent, UserSettingsEvent } from './incoming/user';

export class PacketManager
{
    private _incomingHandlers: { header: IncomingHeader, handler: Incoming }[];

    constructor()
    {
        this._incomingHandlers = [];

        this.registerClient();
        this.registerGames();
        this.registerHandshake();
        this.registerHotelView();
        this.registerMessenger();
        this.registerNavigator();
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
        this.addHandler(IncomingHeader.RELEASE_VERSION, ClientReleaseVersionEvent);
        this.addHandler(IncomingHeader.CLIENT_PING, ClientPingEvent);
        this.addHandler(IncomingHeader.CLIENT_VARIABLES, ClientVariablesEvent);
        this.addHandler(IncomingHeader.CROSS_DOMAIN, CrossDomainEvent);
        this.addHandler(IncomingHeader.CLIENT_LATENCY, ClientLatencyEvent);
        this.addHandler(IncomingHeader.EVENT_TRACKER, EventTrackerEvent);
    }

    private registerGames(): void
    {
        this.addHandler(IncomingHeader.GAMES_INIT, GamesInitEvent);
        this.addHandler(IncomingHeader.GAMES_LIST, GetGamesEvent);
    }

    private registerHandshake(): void
    {
        this.addHandler(IncomingHeader.MACHINE_ID, MachineIdEvent);
        this.addHandler(IncomingHeader.SECURITY_TICKET, SecurityTicketEvent);
    }

    private registerHotelView(): void
    {
        this.addHandler(IncomingHeader.HOTELVIEW_CAMPAIGNS, GetCampaignsEvent);
        this.addHandler(IncomingHeader.HOTELVIEW_ARTICLES, GetArticlesEvent);
    }

    private registerMessenger(): void
    {
        this.addHandler(IncomingHeader.MESSENGER_ACCEPT, MessengerAcceptEvent);
        this.addHandler(IncomingHeader.MESSENGER_CHAT, MessengerChatEvent);
        this.addHandler(IncomingHeader.MESSENGER_FRIENDS, MessengerFriendsEvent);
        this.addHandler(IncomingHeader.MESSENGER_INIT, MessengerInitEvent);
        this.addHandler(IncomingHeader.MESSENGER_REMOVE, MessengerRemoveEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUEST, MessengerRequestEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUESTS, MessengerRequestsEvent);
        this.addHandler(IncomingHeader.MESSENGER_SEARCH, MessengerSearchEvent);
    }

    private registerNavigator(): void
    {
        this.addHandler(IncomingHeader.NAVIGATOR_INIT, NavigatorInitEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_ROOMS, NavigatorRoomsEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SETTINGS, NavigatorSettingsEvent);
    }

    private registerUser(): void
    {
        this.addHandler(IncomingHeader.USER_CLUB, UserClubEvent);
        this.addHandler(IncomingHeader.USER_CREDITS, UserCreditsEvent);
        this.addHandler(IncomingHeader.USER_CURRENT_BADGES, UserCurrentBadgesEvent);
        this.addHandler(IncomingHeader.USER_FIGURE, UserFigureEvent);
        this.addHandler(IncomingHeader.USER_IGNORED, UserIgnoredEvent);
        this.addHandler(IncomingHeader.USER_INFO, UserInfoEvent);
        this.addHandler(IncomingHeader.USER_ONLINE, UserOnlineEvent);
        this.addHandler(IncomingHeader.USER_PROFILE, UserProfileEvent);
        this.addHandler(IncomingHeader.USER_RELATIONSHIPS, UserRelationshipsEvent);
        this.addHandler(IncomingHeader.USER_SANCTION_STATUS, UserSanctionStatusEvent);
        this.addHandler(IncomingHeader.USER_SETTINGS, UserSettingsEvent);
    }

    public async processPacket(user: User, packet: IncomingPacket)
    {
        if(!packet.header) return Promise.resolve(true);

        //if(packet.header !== IncomingHeader.RELEASE_VERSION && packet.header !== IncomingHeader.CLIENT_VARIABLES && packet.header !== IncomingHeader.CROSS_DOMAIN && packet.header !== IncomingHeader.MACHINE_ID && packet.header !== IncomingHeader.SECURITY_TICKET && !user.isAuthenticated) throw new Error('invalid_authentication');

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