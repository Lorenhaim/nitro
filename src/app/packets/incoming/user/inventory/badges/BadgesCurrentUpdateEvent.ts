import { Logger } from '../../../../../common';

import { BadgesCurrentComposer } from '../../../../outgoing';

import { Incoming } from '../../../Incoming';
import { IncomingHeader } from '../../../IncomingHeader';

export class BadgesCurrentUpdateEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_BADGES_CURRENT_UPDATE) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.inventory() && this.user.inventory().badges())
            {
                await this.user.inventory().badges().resetAllSlots();

                for(let i = 0; i < 5; i++)
                {
                    const slotNumber    = this.packet.readInt();
                    const badgeCode     = this.packet.readString();

                    await this.user.inventory().badges().setSlotNumber(badgeCode, <any> slotNumber);
                }

                await this.user.client().processComposer(new BadgesCurrentComposer(this.user, this.user.userId));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}