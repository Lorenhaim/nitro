import { UnitHandItem } from '../../../../game';
import { Incoming } from '../../Incoming';

export class UnitDropHandItemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.user.unit.location.hand(UnitHandItem.NONE);
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