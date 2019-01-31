import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { SecurityTicketComposer, UserHomeRoomComposer, UserRightsComposer, ModToolComposer, EffectsComposer, ClothingOutfitsComposer, UserPermissionsComposer, UserFirstLoginOfDayComposer, UserAchievementScoreComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class SecurityTicketEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.SECURITY_TICKET) throw new Error('invalid_header');

            if(!this.user.isAuthenticated)
            {
                await this.user.checkTicket(this.packet.readString());

                if(this.user.isAuthenticated)
                {
                    await this.user.loadUser();

                    if(this.user.isLoaded)
                    {
                        await Emulator.gameManager().userManager().addUser(this.user);

                        await this.user.setOnline(true);

                        await this.user.client().processComposer(new SecurityTicketComposer(this.user));
                        await this.user.client().processComposer(new UserHomeRoomComposer(this.user));
                        await this.user.client().processComposer(new UserRightsComposer(this.user));
                        await this.user.client().processComposer(new UserPermissionsComposer(this.user));
                        await this.user.client().processComposer(new EffectsComposer(this.user));
                        await this.user.client().processComposer(new ClothingOutfitsComposer(this.user));
                        await this.user.client().processComposer(new UserFirstLoginOfDayComposer(this.user));
                        await this.user.client().processComposer(new UserAchievementScoreComposer(this.user));

                        await this.user.client().processComposer(new ModToolComposer(this.user));
                    }
                }
            }

            return true;
        }

        catch(err)
        {
            await this.user.dispose();

            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}