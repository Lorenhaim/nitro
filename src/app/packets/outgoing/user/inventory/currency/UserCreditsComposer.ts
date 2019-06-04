import { CurrencyType } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserCreditsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CREDITS);
    }

    public compose(): OutgoingPacket
    {
        const currency = this.client.user.inventory.currency.getCurrency(CurrencyType.CREDITS);

        if(!currency) return this.packet.writeString('0').prepare();

        return this.packet.writeString(currency.amount.toString()).prepare();
    }
}