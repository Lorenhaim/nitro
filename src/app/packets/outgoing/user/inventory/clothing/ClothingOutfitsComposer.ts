import { Logger } from '../../../../../common';
import { User } from '../../../../../game';

import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ClothingOutfitsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_OUTFITS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                if(this.user.inventory() && this.user.inventory().outfits())
                {
                    if(!this.user.inventory().outfits().isLoaded) await this.user.inventory().outfits().init();

                    if(this.user.inventory().outfits().isLoaded)
                    {
                        const totalOutfits = this.user.inventory().outfits().outfits.length;

                        if(totalOutfits)
                        {
                            const outfitIds: number[]       = [];
                            const outfitFigures: string[]   = [];

                            for(let i = 0; i < totalOutfits; i++)
                            {
                                const outfit = this.user.inventory().outfits().outfits[i];

                                outfitIds.push(outfit.id);
                                outfitFigures.push(outfit.figure);
                            }

                            const totalOutfitIds        = outfitIds.length;
                            const totalOutfitFigures    = outfitFigures.length;

                            if(totalOutfitIds === totalOutfitFigures)
                            {
                                this.packet.writeInt(totalOutfitIds);

                                for(let i = 0; i < totalOutfitIds; i++) this.packet.writeInt(outfitIds[i]);

                                this.packet.writeInt(totalOutfitFigures);

                                for(let i = 0; i < totalOutfitFigures; i++) this.packet.writeString(outfitFigures[i]);
                            }
                            else
                            {
                                this.packet.writeInt(0);
                                this.packet.writeInt(0);
                            }
                        }
                        else
                        {
                            this.packet.writeInt(0);
                            this.packet.writeInt(0);
                        }
                    }
                    else
                    {
                        this.packet.writeInt(0);
                        this.packet.writeInt(0);
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                    this.packet.writeInt(0);
                }

                this.packet.prepare();

                return this.packet;
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}