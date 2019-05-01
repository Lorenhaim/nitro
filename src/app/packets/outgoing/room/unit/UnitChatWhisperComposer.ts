import { ChatBubble, UnitEmotion } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitChatWhisperComposer extends Outgoing
{
    private _chat: any;

    constructor(chat: any)
    {
        super(OutgoingHeader.UNIT_CHAT_WHISPER);

        this._chat =  {
            unit: chat.unit || null,
            message: chat.message || null,
            emotion: chat.emotion || UnitEmotion.NORMAL,
            bubble: chat.bubble || ChatBubble.NORMAL
        };
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this._chat.unit && this._chat.message)
            {
                return this.packet
                    .writeInt(this._chat.unit.id)
                    .writeString(this._chat.message)
                    .writeInt(this._chat.emotion)
                    .writeInt(this._chat.bubble)
                    .writeInt(0)
                    .writeInt(this._chat.message.length)
                    .prepare();
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }
}
/*
NORMAL(0, "", true, true),
    ALERT(1, "", true, true),
    BOT(2, "", true, true),
    RED(3, "", true, true),
    BLUE(4, "", true, true),
    YELLOW(5, "", true, true),
    GREEN(6, "", true, true),
    BLACK(7, "", true, true),
    FORTUNE_TELLER(8, "", false, false),
    ZOMBIE_ARM(9, "", true, false),
    SKELETON(10, "", true, false),
    LIGHT_BLUE(11, "", true, true),
    PINK(12, "", true, true),
    PURPLE(13, "", true, true),
    DARK_YEWLLOW(14, "", true, true),
    DARK_BLUE(15, "", true, true),
    HEARTS(16, "", true, true),
    ROSES(17, "", true, true),
    UNUSED(18, "", true, true),
    PIG(19, "", true, true),
    DOG(20, "", true, true),
    BLAZE_IT(21, "", true, true),
    DRAGON(22, "", true, true),
    STAFF(23, "", false, true),
    BATS(24, "", true, false),
    MESSENGER(25, "", true, false),
    STEAMPUNK(26, "", true, false),
    THUNDER(27, "", true, true),
    PARROT(28, "", false, false),
    PIRATE(29, "", false, false),
    BOT_GUIDE(30, "", true, true),
    BOT_RENTABLE(31, "", true, true),
    SCARY_THING(32, "", true, false),
    FRANK(33, "", true, false),
    WIRED(34, "", false, true),
    GOAT(35, "", true, false),
    SANTA(36, "", true, false),
    AMBASSADOR(37, "acc_ambassador", false, true),
    RADIO(38, "", true, false),
    UNKNOWN_39(39, "", true, false),
    UNKNOWN_40(40, "", true, false),
    UNKNOWN_41(41, "", true, false),
    UNKNOWN_42(42, "", true, false),
    UNKNOWN_43(43, "", true, false),
    UNKNOWN_44(44, "", true, false),
    UNKNOWN_45(45, "", true, false);*/