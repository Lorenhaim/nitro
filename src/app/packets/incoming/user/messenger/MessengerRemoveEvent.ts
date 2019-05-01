import { Incoming } from '../../Incoming';

export class MessengerRemoveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const totalIds = this.packet.readInt();

            if(!totalIds) return;

            const ids: number[] = [];
            
            for(let i = 0; i < totalIds; i++) ids.push(this.packet.readInt());

            if(ids.length) await this.client.user.messenger.removeFriends(...ids);
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