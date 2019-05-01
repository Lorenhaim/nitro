import { Emulator } from '../../../Emulator';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorSettingsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_SETTINGS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded)
            {
                let settings = {
                    x: 100,
                    y: 100,
                    width: 435,
                    height: 535,
                    searchOpen: false
                };

                if(this.client.user.details !== null)
                {
                    settings = { ...settings, ...this.client.user.details.navigatorSettings };
                }

                return this.packet
                    .writeInt(settings.x)
                    .writeInt(settings.y)
                    .writeInt(settings.width)
                    .writeInt(settings.height)
                    .writeBoolean(settings.searchOpen)
                    .writeInt(0)
                    .prepare();
            }

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}