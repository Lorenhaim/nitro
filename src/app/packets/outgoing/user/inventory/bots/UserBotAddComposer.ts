import { Bot } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserBotAddComposer extends Outgoing
{
    private _bot: Bot;

    constructor(bot: Bot)
    {
        super(OutgoingHeader.USER_BOT_ADD);

        if(!bot) throw new Error('invalid_bot');

        this._bot = bot;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this._bot.parseInventoryData(this.packet);

            return this.packet.writeBoolean(true).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}