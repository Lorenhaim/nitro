import { Emulator } from '../../../Emulator';
import { GenericAlertComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserOnlineEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(Emulator.config.game.login.alert.enabled) this.client.processOutgoing(new GenericAlertComposer(Emulator.config.game.login.alert.message, `https://discord.gg/4K7MEMz`));

            if(this.client.user.details.homeRoom) this.client.user.unit.fowardRoom(this.client.user.details.homeRoom);
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