import { User } from '../game';

import { Incoming, IncomingHeader, IncomingPacket } from './incoming';
import { ClientLatencyEvent, ClientReleaseVersionEvent, ClientVariablesEvent, CrossDomainEvent, EventTrackerEvent } from './incoming/client';
import { GamesInitEvent, GetGamesEvent } from './incoming/games';
import { MachineIdEvent, SecurityTicketEvent } from './incoming/handshake';
import { GetArticlesEvent, GetCampaignsEvent } from './incoming/hotelview';
import { MessengerAcceptEvent, MessengerInitEvent, MessengerRemoveEvent, MessengerRequestEvent, MessengerRequestsEvent, MessengerSearchEvent } from './incoming/messenger';
import { UserClubEvent, UserCreditsEvent, UserFigureEvent, UserInfoEvent, UserProfileEvent, UserRelationshipsEvent } from './incoming/user';

export class PacketManager
{
    private _incomingEvents: { header: IncomingHeader, handler: Incoming }[];

    constructor()
    {
        this._incomingEvents = [];

        this.registerClient();
        this.registerHandshake();
        this.registerHotelView();
        this.registerGames();
        this.registerMessenger();
        this.registerUser();
    }

    public addHandler(header: IncomingHeader, handler: any): boolean
    {
        if(!(handler.prototype instanceof Incoming)) return false;
        
        let result = false;

        for(const [index, existing] of this._incomingEvents.entries())
        {
            if(existing.header === header)
            {
                result = true;

                this._incomingEvents.splice(index, 1);

                this._incomingEvents.push({ header, handler });

                break;
            }
        }

        if(!result) this._incomingEvents.push({ header, handler });
        
        return true;
    }

    private registerClient(): void
    {
        this.addHandler(IncomingHeader.RELEASE_VERSION, ClientReleaseVersionEvent);
        this.addHandler(IncomingHeader.CLIENT_VARIABLES, ClientVariablesEvent);
        this.addHandler(IncomingHeader.CROSS_DOMAIN, CrossDomainEvent);
        this.addHandler(IncomingHeader.CLIENT_LATENCY, ClientLatencyEvent);
        this.addHandler(IncomingHeader.EVENT_TRACKER, EventTrackerEvent);
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

    private registerGames(): void
    {
        this.addHandler(IncomingHeader.GAMES_INIT, GamesInitEvent);
        this.addHandler(IncomingHeader.GAMES_LIST, GetGamesEvent);
    }

    private registerMessenger(): void
    {
        this.addHandler(IncomingHeader.MESSENGER_ACCEPT, MessengerAcceptEvent);
        this.addHandler(IncomingHeader.MESSENGER_INIT, MessengerInitEvent);
        this.addHandler(IncomingHeader.MESSENGER_REMOVE, MessengerRemoveEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUEST, MessengerRequestEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUESTS, MessengerRequestsEvent);
        this.addHandler(IncomingHeader.MESSENGER_SEARCH, MessengerSearchEvent);
    }

    private registerUser(): void
    {
        this.addHandler(IncomingHeader.USER_CLUB, UserClubEvent);
        this.addHandler(IncomingHeader.USER_CREDITS, UserCreditsEvent);
        this.addHandler(IncomingHeader.USER_FIGURE, UserFigureEvent);
        this.addHandler(IncomingHeader.USER_INFO, UserInfoEvent);
        this.addHandler(IncomingHeader.USER_PROFILE, UserProfileEvent);
        this.addHandler(IncomingHeader.USER_RELATIONSHIPS, UserRelationshipsEvent);
    }

    public async processPacket(user: User, buffer: Buffer)
    {
        const packet: IncomingPacket = new IncomingPacket(buffer);

        const realPacketLength = packet.packetLength + 4;

        if(packet.bufferLength > realPacketLength)
        {
            const currentBuffer: Buffer = buffer.slice(0, realPacketLength);
            const nextBuffer: Buffer    = buffer.slice(realPacketLength);

            await this.processPacket(user, currentBuffer);
            await this.processPacket(user, nextBuffer);

            return;
        }

        if(!packet.header) return Promise.resolve(true);

        if(packet.header !== IncomingHeader.RELEASE_VERSION && packet.header !== IncomingHeader.CLIENT_VARIABLES && packet.header !== IncomingHeader.CROSS_DOMAIN && packet.header !== IncomingHeader.MACHINE_ID && packet.header !== IncomingHeader.SECURITY_TICKET && !user.isAuthenticated) throw new Error('invalid_authentication');

        let packetHandler: Incoming = null;

        for(const event of this._incomingEvents)
        {
            if(event.header === packet.header)
            {
                let getHandler: any     = event.handler;
                let handler: Incoming   = new getHandler();

                if(!(handler instanceof Incoming)) break;

                handler.user    = user;
                handler.packet  = packet;

                packetHandler = handler;
            }
        }

        if(!packetHandler) return Promise.reject(new Error(`Invalid Handler -> ${ packet.header }`));

        await packetHandler.process();

        return Promise.resolve(true);
    }
}