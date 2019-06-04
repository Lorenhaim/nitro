import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ModerationReportDisabledComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MODERATION_REPORT_DISABLED);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeString('').prepare();
    }
}