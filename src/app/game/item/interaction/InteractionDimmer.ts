import { Unit } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { OnClick, OnPickup } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionDimmer extends InteractionDefault implements OnPickup, OnClick
{
    constructor()
    {
        super('dimmer');
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }

    public onPickup(user: User, item: Item): void
    {
        if(user && item) item.setExtraData(0);
    }
}