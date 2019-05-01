import { NavigatorSettings } from '../../../game';
import { Incoming } from '../Incoming';

export class NavigatorSettingsSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const navigatorSettings: NavigatorSettings = {
                x: this.packet.readInt(),
                y: this.packet.readInt(),
                width: this.packet.readInt(),
                height: this.packet.readInt(),
                searchOpen: this.packet.readBoolean()
            }
            
            this.client.user.details.updateNavigator(navigatorSettings);
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