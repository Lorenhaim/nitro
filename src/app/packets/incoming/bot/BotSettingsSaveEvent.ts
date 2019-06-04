import { BotSetting } from '../../../game';
import { Incoming } from '../Incoming';

export class BotSettingsSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const bot = currentRoom.botManager.getBot(this.packet.readInt());

            if(!bot) return;

            const setting = this.packet.readInt();

            if(!setting) return;

            if(setting === BotSetting.FIGURE) return bot.updateFigure(this.client.user, this.client.user.details.figure, this.client.user.details.gender);
            else if(setting === BotSetting.FREE_ROAM) return bot.toggleRoaming(this.client.user);
            else if(setting === BotSetting.DANCE) return bot.toggleDance(this.client.user);
            else if(setting === BotSetting.NAME) return bot.updateName(this.client.user, this.packet.readString());
            else if(setting === BotSetting.MOTTO) return bot.updateMotto(this.client.user, this.packet.readString());
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}