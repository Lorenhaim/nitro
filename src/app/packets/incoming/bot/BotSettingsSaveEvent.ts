import { BotSetting, UnitDance } from '../../../game';
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

            if(setting === BotSetting.FIGURE)
            {
                bot.updateFigure(this.client.user.details.figure, this.client.user.details.gender);

                return;
            }

            else if(setting === BotSetting.FREE_ROAM)
            {
                if(bot.freeRoam) bot.updateRoaming(false);
                else bot.updateRoaming(true);
            }

            else if(setting === BotSetting.DANCE)
            {
                if(bot.dance) bot.updateDance(UnitDance.NONE);
                else bot.updateDance(UnitDance.NORMAL);

                return;
            }
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