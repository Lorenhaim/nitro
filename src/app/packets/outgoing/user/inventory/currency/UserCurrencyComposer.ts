import { CurrencyType } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserCurrencyComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CURRENCY);
    }

    public compose(): OutgoingPacket
    {
        const currencies = this.client.user.inventory.currency.getAllCurrencies(CurrencyType.CREDITS);

        if(!currencies) return this.packet.writeInt(0).prepare();

        const totalCurrencies = currencies.length;

        if(!currencies) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalCurrencies);

        for(let i = 0; i < totalCurrencies; i++)
        {
            const currency = currencies[i];

            this.packet.writeInt(currency.type, currency.amount);
        }

        return this.packet.prepare();
    }
}