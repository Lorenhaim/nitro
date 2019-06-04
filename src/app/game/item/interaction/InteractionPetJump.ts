import { Position } from '../../pathfinder';
import { Unit, UnitStatus, UnitStatusType, UnitType } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { BeforeStep, OnClick, OnEnter, OnLeave, OnPickup, OnStep, OnStop, ParseExtraData } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionPetJump extends InteractionDefault implements OnStop, OnLeave, ParseExtraData, OnClick, OnStep, OnEnter, OnPickup, BeforeStep
{
    constructor()
    {
        super('pet_jump');
    }

    public onPickup(user: User, item: Item): void
    {
        if(user && item) item.setExtraData(0);
    }

    public onEnter(unit: Unit, item: Item): void
    {
        super.onEnter(unit, item);
    }

    public beforeStep(unit: Unit, item: Item): void
    {
        super.beforeStep(unit, item);

        if(!unit) return;

        if(!unit.location.isWalking) return;

        const currentItem = unit.location.getCurrentItem();

        if(unit.location.getCurrentItem() !== item) return;

        if(unit.type === UnitType.PET)
        {
            if(unit.location.hasStatus(UnitStatusType.JUMP)) unit.location.removeStatus(UnitStatusType.JUMP);
            else unit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));

            unit.updateNow();
        }

        if(unit.type === UnitType.USER)
        {
            if(unit.connectedUnit && unit.connectedUnit.type === UnitType.PET)
            {
                if(unit.connectedUnit.location.hasStatus(UnitStatusType.JUMP)) unit.location.removeStatus(UnitStatusType.JUMP);
                else unit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));
            }
        }
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.onStep(unit, item);

        // if(unit.type !== UnitType.PET) return;

        // if(unit.location.hasStatus(UnitStatusType.JUMP))
        // {
        //     item.toggleRandomState();

        //     unit.location.removeStatus(UnitStatusType.JUMP);

        //     setTimeout(() => item.setExtraData(0), 2000);
        // }
        // else unit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));
    }

    public onStop(unit: Unit, item: Item): void
    {
        super.onStop(unit, item);

        if(unit.type !== UnitType.PET) return;

        unit.location.removeStatus(UnitStatusType.JUMP);

        unit.updateNow();
    }

    public onLeave(unit: Unit, item: Item, positionNext: Position): void
    {
        super.onLeave(unit, item, positionNext);

        if(unit.type !== UnitType.PET) return;

        unit.location.removeStatus(UnitStatusType.JUMP);
    }
}