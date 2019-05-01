import { Position } from '../../pathfinder';
import { Unit, UnitStatus, UnitStatusType, UnitType } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { OnClick, OnEnter, OnLeave, OnPickup, OnStep, OnStop, ParseExtraData } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionPetJump extends InteractionDefault implements OnStop, OnLeave, ParseExtraData, OnClick, OnStep, OnEnter, OnPickup
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

    public onStep(unit: Unit, item: Item): void
    {
        super.onStep(unit, item);

        if(!unit) return;

        const connectedUnit = unit.connectedUnit;

        if(!connectedUnit) return;

        if(connectedUnit.type !== UnitType.PET) return;

        //connectedUnit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));
    }

    public onStop(unit: Unit, item: Item): void
    {
        super.onStop(unit, item);

        const connectedUnit = unit.connectedUnit;

        if(!connectedUnit) return;

        if(connectedUnit.type !== UnitType.PET) return;

        connectedUnit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));
    }

    public onLeave(unit: Unit, item: Item, positionNext: Position): void
    {
        super.onLeave(unit, item, positionNext);

        if(!unit) return;

        const connectedUnit = unit.connectedUnit;

        if(!connectedUnit) return;

        if(connectedUnit.type !== UnitType.PET) return;

        connectedUnit.location.removeStatus(UnitStatusType.JUMP);
    }
}