import { Currency } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class CurrencyComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CURRENCY);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const currenciesToSend: Currency[] = [];

            if(this.client.user.inventory.currencies !== null)
            {
                const currencies = this.client.user.inventory.currencies.currencies;

                if(currencies !== null)
                {
                    const totalCurrencies = currencies.length;

                    if(totalCurrencies > 0)
                    {
                        for(let i = 0; i < totalCurrencies; i++)
                        {
                            const currency = currencies[i];

                            if(currency.type !== -1) currenciesToSend.push(currency);
                        }
                    }
                }
            }

            const totalToSend = currenciesToSend.length;

            if(totalToSend > 0)
            {
                this.packet.writeInt(totalToSend);

                for(let i = 0; i < totalToSend; i++)
                {
                    const currency = currenciesToSend[i];

                    this.packet.writeInt(currency.type, currency.amount);
                }

                return this.packet.prepare();
            }
            else
            {
                return this.packet.writeInt(0).prepare();
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }
}