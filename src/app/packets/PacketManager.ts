import { User } from '../game';

import { Incoming, IncomingHeader, IncomingPacket } from './incoming';
import { ClientLatencyEvent, ClientReleaseVersionEvent, ClientVariablesEvent, EventTrackerEvent } from './incoming/client';
import { GetGamesEvent } from './incoming/games';
import { MachineIdEvent, SecurityTicketEvent } from './incoming/handshake';
import { GetArticlesEvent, GetCampaignsEvent } from './incoming/hotelview';
import { MessengerInitEvent } from './incoming/messenger';
import { UserClubEvent, UserInfoEvent, UserProfileEvent } from './incoming/user';

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

    public getHandler(header: IncomingHeader): Incoming
    {
        let result = null;

        for(const event of this._incomingEvents)
        {
            if(event.header === header)
            {
                result = event.handler;

                break;
            }
        }

        return result;
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
        this.addHandler(IncomingHeader.GAMES_LIST, GetGamesEvent);
    }

    private registerMessenger(): void
    {
        this.addHandler(IncomingHeader.MESSENGER_INIT, MessengerInitEvent);
    }

    private registerUser(): void
    {
        this.addHandler(IncomingHeader.USER_INFO, UserInfoEvent);
        this.addHandler(IncomingHeader.USER_CLUB, UserClubEvent);
        this.addHandler(IncomingHeader.USER_PROFILE, UserProfileEvent);
    }

    public async processPacket(user: User, buffer: Buffer)
    {
        const packet: IncomingPacket = new IncomingPacket(buffer);

        if(packet.packetLength === 1014001516)
        {
            user.client().write(Buffer.from(`<?xml version=\"1.0\"?>\n<!DOCTYPE cross-domain-policy SYSTEM \"/xml/dtds/cross-domain-policy.dtd\">\n<cross-domain-policy>\n<allow-access-from domain=\"*\" to-ports=\"1-31111\" />\n</cross-domain-policy>`, 'utf8'));

            await user.dispose();

            return Promise.resolve(true);
        }

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

        const handler: any = this.getHandler(packet.header);

        if(!handler)
        {
            console.log(`Unhandled Packet -> ${ packet.header }`);
            return Promise.resolve(true);
        }

        const handlerInstance = new handler();

        handlerInstance.user    = user;
        handlerInstance.packet  = packet;

        if(!handlerInstance) return Promise.reject(new Error('invalid_handler'));

        await handlerInstance.process();

        return Promise.resolve(true);
    }
}