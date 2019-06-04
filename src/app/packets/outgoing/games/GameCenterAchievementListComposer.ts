import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GameCenterAchievementsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.GAME_CENTER_ACHIEVEMENTS);
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1).writeString('BaseJumpBigParachute').writeInt(1).prepare();
    }
}