import { NumberHelper } from '../../../common';
import { Unit } from '../../unit';
import { User } from '../../user';
import { BaseItemType } from '../base';
import { Item } from '../Item';
import { OnPickup } from './actions';
import { OnDiceClick } from './actions/OnDiceClick';
import { OnDiceClose } from './actions/OnDiceClose';
import { InteractionDefault } from './InteractionDefault';

export class InteractionDice extends InteractionDefault implements OnPickup, OnDiceClick, OnDiceClose
{
    constructor()
    {
        super('dice');
    }

    public onPickup(user: User, item: Item): void
    {
        if(item) item.setExtraData(0);
    }

    public onDiceClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const room = item.room;

        if(!room) return;

        if(!unit.hasRights()) return;

        if(item.baseItem.type === BaseItemType.FLOOR && !unit.location.position.isNear(item.position)) return;
        
        const randomNumber = NumberHelper.randomNumber(1, item.baseItem.totalStates - 1);

        if(randomNumber)
        {
            item.setExtraData(-1);

            setTimeout(() => item.extraData !== '0' && item.setExtraData(randomNumber), item.baseItem.type === BaseItemType.FLOOR ? 1500 : 3000);
        }

        super.onClick(unit, item, false);
    }

    public onDiceClose(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const room = item.room;

        if(!room) return;

        if(!unit.hasRights() || !unit.location.position.isNear(item.position)) return;

        item.setExtraData(0);

        super.onClick(unit, item, false);
    }
}