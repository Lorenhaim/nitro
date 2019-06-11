import { UserEntity } from '../../../../database';
import { Nitro } from '../../../../Nitro';
import { MessengerSearchComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerSearchEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const friendResults: UserEntity[]   = [];
            const otherResults: UserEntity[]    = [];

            const results = await Nitro.gameManager.userManager.searchUsersByUsername(this.packet.readString());

            if(results)
            {
                const totalResults = results.length;

                if(totalResults)
                {
                    for(let i = 0; i < totalResults; i++)
                    {
                        const result = results[i];

                        if(!result) continue;

                        if(result.id === this.client.user.id) continue;

                        if(this.client.user.messenger.hasFriend(result.id)) friendResults.push(result);
                        else otherResults.push(result);
                    }
                }
            }

            this.client.processOutgoing(new MessengerSearchComposer(friendResults, otherResults));
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