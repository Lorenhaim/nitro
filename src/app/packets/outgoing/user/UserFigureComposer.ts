import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserFigureComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_FIGURE);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeString(this.client.user.details.figure)
                .writeString(this.client.user.details.gender)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}