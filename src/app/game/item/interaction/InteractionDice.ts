import { NumberHelper } from '../../../common';
import { Unit } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { OnClick, OnClickAlternative, OnPickup } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionDice extends InteractionDefault implements OnClick, OnPickup, OnClickAlternative
{
    constructor()
    {
        super('dice');
    }

    public onPickup(user: User, item: Item): void
    {
        if(user && item) item.setExtraData(0);
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const room = item.room;

        if(!room) return;

        if(!unit.hasRights() || !unit.location.position.isNear(item.position)) return;
        
        const randomNumber = NumberHelper.randomNumber(1, 6);

        if(randomNumber)
        {
            item.setExtraData(-1);

            setTimeout(() =>
            {
                if(!item.isItemClosed) item.setExtraData(randomNumber);
            }, 1000);
        }
    }

    public onClickAlternative(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const room = item.room;

        if(!room) return;

        if(!unit.hasRights() || !unit.location.position.isNear(item.position)) return;

        item.setExtraData(0);
    }
}