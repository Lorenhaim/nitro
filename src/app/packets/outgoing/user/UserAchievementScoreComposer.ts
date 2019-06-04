import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserAchievementScoreComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_ACHIEVEMENT_SCORE);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this.client.user.details.achievementScore).prepare();
    }
}