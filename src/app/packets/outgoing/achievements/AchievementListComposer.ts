import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class AchievementListComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.ACHIEVEMENT_LIST);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(0).writeString(null).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}