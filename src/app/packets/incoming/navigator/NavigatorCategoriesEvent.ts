import { NavigatorCategoriesComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class NavigatorCategoriesEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new NavigatorCategoriesComposer());
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