import { Unit } from '../../unit';
import { Item } from '../Item';
import { BeforeStep, OnClick, OnLeave } from './actions';
import { InteractionGroupFurni } from './InteractionGroupFurni';

export class InteractionGroupGate extends InteractionGroupFurni implements OnClick, BeforeStep, OnLeave
{
    constructor()
    {
        super('group_gate');
    }

    public beforeStep(unit: Unit, item: Item): void
    {
        item.setExtraData(1);
    }

    public onLeave(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        setTimeout(() => item.setExtraData(0), 500);
    }

    public onClick(unit: Unit, item: Item): void
    {
        return;
    }
}