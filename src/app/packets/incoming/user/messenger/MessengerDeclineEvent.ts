import { Incoming } from '../../Incoming';

export class MessengerDeclineEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.packet.readBoolean())
            {
                await this.client.user.messenger.removeAllRequests();
            }
            else
            {
                const totalIds = this.packet.readInt();

                if(!totalIds) return;

                const ids: number[] = [];

                for(let i = 0; i < totalIds; i++) ids.push(this.packet.readInt());
                    
                if(ids.length) await this.client.user.messenger.removeRequests(...ids);
            }
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