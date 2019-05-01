import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class HotelViewCampaignComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.HOTEL_VIEW_CAMPAIGN);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeString('') // data
                .writeString('') // key
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}