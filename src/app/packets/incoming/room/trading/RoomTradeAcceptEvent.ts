import { Incoming } from '../../Incoming';

export class RoomTradeAcceptEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const tradeUser = this.client.user.unit.tradeUser;

            if(!tradeUser) return;

            tradeUser.accept();
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