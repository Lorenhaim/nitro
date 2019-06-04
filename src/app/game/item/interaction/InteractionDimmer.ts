import { User } from '../../user';
import { Item } from '../Item';
import { OnPickup } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionDimmer extends InteractionDefault implements OnPickup
{
    constructor()
    {
        super('dimmer');
    }

    public onPickup(user: User, item: Item): void
    {
        if(user && item) item.setExtraData(0);
    }
}