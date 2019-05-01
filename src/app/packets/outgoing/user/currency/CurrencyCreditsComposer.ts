import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class CurrencyCreditsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CREDITS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this.client.user.inventory.currencies !== null)
            {
                const credits = this.client.user.inventory.currencies.getCurrency(-1);

                if(credits !== null)
                {
                    return this.packet.writeString(`${ credits.amount }.0`).prepare();
                }
            }

            return this.packet.writeString('0').prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}