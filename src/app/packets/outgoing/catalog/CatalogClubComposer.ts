import { TimeHelper } from '../../../common';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogClubComposer extends Outgoing
{
    private _windowId: number;

    constructor(windowId: number)
    {
        super(OutgoingHeader.CATALOG_CLUB);

        this._windowId = windowId;
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(1);

        this.parseSubscription(this.packet, 1, 'HABBO_CLUB_1_MONTH');

        //this.parseSubscription(this.packet, 2, 'HABBO_CLUB_3_MONTHS');

        return this.packet.writeInt(this._windowId).prepare();
    }

    private parseSubscription(packet: OutgoingPacket, id: number, name: string): OutgoingPacket
    {
        if(!packet || !id || !name) return null;

        this.packet
            .writeInt(id) // offer id
            .writeString(name) // name
            .writeBoolean(false)
            .writeInt(1) // credits
            .writeInt(0) // points
            .writeInt(0) // point type
            .writeBoolean(this.client.user.details.clubActive);

        let totalSeconds = 31 * 86400;

        const totalYears = Math.floor(totalSeconds / 86400 * 31 * 12);

        totalSeconds -= totalYears * 86400 * 31 * 12;
            
        const totalMonths = Math.floor(totalSeconds / 86400 * 31);

        totalSeconds -= totalMonths * 86400 * 31;

        const totalDays = Math.floor(totalSeconds / 86400);

        totalSeconds -= totalDays * 86400;

        packet
            .writeInt(totalSeconds / 86400 / 31)
            .writeInt(totalSeconds)
            .writeBoolean(false)
            .writeInt(totalSeconds);

        const remaining = TimeHelper.timeBetween(TimeHelper.now, this.client.user.details.clubExpiration);

        return packet.writeInt(remaining.years, remaining.months, remaining.days);
    }
}