import { Incoming } from '../../Incoming';

export class RoomTradeItemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const tradeUser = this.client.user.unit.tradeUser;

            if(!tradeUser) return;
            
            const item = this.client.user.inventory.items.getItem(this.packet.readInt());

            if(!item) return;

            tradeUser.offerItems(item);
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