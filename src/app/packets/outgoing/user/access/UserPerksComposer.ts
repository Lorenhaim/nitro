import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UserPerksComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_PERKS);
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(15);
        this.packet.writeString("USE_GUIDE_TOOL");
        this.packet.writeString("requirement.unfulfilled.helper_level_4");
        this.packet.writeBoolean(true);
        this.packet.writeString("GIVE_GUIDE_TOURS");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("JUDGE_CHAT_REVIEWS");
        this.packet.writeString("requirement.unfulfilled.helper_level_6");
        this.packet.writeBoolean(true);
        this.packet.writeString("VOTE_IN_COMPETITIONS");
        this.packet.writeString("requirement.unfulfilled.helper_level_2");
        this.packet.writeBoolean(true);
        this.packet.writeString("CALL_ON_HELPERS");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("CITIZEN");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("TRADE");
        this.packet.writeString("requirement.unfulfilled.no_trade_lock");
        this.packet.writeBoolean(true);
        this.packet.writeString("HEIGHTMAP_EDITOR_BETA");
        this.packet.writeString("requirement.unfulfilled.feature_disabled");
        this.packet.writeBoolean(true);
        this.packet.writeString("BUILDER_AT_WORK");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("CALL_ON_HELPERS");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("CAMERA");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("NAVIGATOR_PHASE_TWO_2014");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("MOUSE_ZOOM");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("NAVIGATOR_ROOM_THUMBNAIL_CAMERA");
        this.packet.writeString("");
        this.packet.writeBoolean(true);
        this.packet.writeString("HABBO_CLUB_OFFER_BETA");
        this.packet.writeString("");
        this.packet.writeBoolean(true);

        return this.packet.prepare();
    }
}