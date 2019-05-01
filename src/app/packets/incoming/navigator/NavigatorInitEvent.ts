import { NavigatorCollapsedComposer, NavigatorEventCategoriesComposer, NavigatorLiftedRoomsComposer, NavigatorMetaDataComposer, NavigatorSavedSearchesComposer, NavigatorSettingsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class NavigatorInitEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(
                new NavigatorSettingsComposer(),
                new NavigatorMetaDataComposer(),
                new NavigatorLiftedRoomsComposer(),
                new NavigatorCollapsedComposer(),
                new NavigatorSavedSearchesComposer(),
                new NavigatorEventCategoriesComposer());
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