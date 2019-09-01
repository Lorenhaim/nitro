import { Incoming } from '../../Incoming';

export class RoomTradeCloseEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const tradeUser = this.client.user.unit.tradeUser;

            if(!tradeUser) return;

            tradeUser.stopTrading();
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