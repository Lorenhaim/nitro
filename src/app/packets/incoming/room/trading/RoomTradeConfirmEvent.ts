import { Incoming } from '../../Incoming';

export class RoomTradeConfirmEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const tradeUser = this.client.user.unit.tradeUser;

            if(!tradeUser) return;

            tradeUser.confirm();
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