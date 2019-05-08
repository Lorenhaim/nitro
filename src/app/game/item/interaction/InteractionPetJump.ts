import { UnitStatusComposer } from '../../../packets';
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

        if(unit.location.getCurrentItem() !== item) return;

        if(!unit.location.isWalking) return;

        const connectedUnit = unit.connectedUnit;

        if(connectedUnit)
        {
            if(connectedUnit.type !== UnitType.PET) return;

            if(connectedUnit.location.getCurrentItem() !== item) return;

            if(!connectedUnit.location.isWalking) return;
            
            if(connectedUnit.location.hasStatus(UnitStatusType.JUMP)) connectedUnit.location.removeStatus(UnitStatusType.JUMP);
            else connectedUnit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));

            unit.room.unitManager.processOutgoing(new UnitStatusComposer(connectedUnit));
        }
        else
        {
            if(unit.location.hasStatus(UnitStatusType.JUMP))
            {
                const move = unit.location.getStatus(UnitStatusType.MOVE);

                if(move)
                {
                    unit.location.position.z += 0.5;

                    const parts = move.value.split(',');

                    //if(parts.length === 3) move.setValue(`${ parts[0] },${ parts[1] },${ parseFloat(parts[2]) - 0.5 }`);
                }

                unit.location.removeStatus(UnitStatusType.JUMP);
            }
            else
            {
                const move = unit.location.getStatus(UnitStatusType.MOVE);

                if(move)
                {
                    const parts = move.value.split(',');

                    move.setValue(`${ parts[0] },${ parts[1] },${ parseFloat(parts[2]) + 0.5 }`);
                }

                unit.location.addStatus(new UnitStatus(UnitStatusType.JUMP, '0'));

                unit.location.position.z += 0.5;
            }

            unit.room.unitManager.processOutgoing(new UnitStatusComposer(unit));
        }
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.onStep(unit, item);

        const connectedUnit = unit.connectedUnit;

        if(!connectedUnit) return;

        if(connectedUnit.type !== UnitType.PET) return;

        if(connectedUnit.location.hasStatus(UnitStatusType.JUMP)) item.toggleRandomState();

        setTimeout(() => item.setExtraData(0), 2000);
    }

    public onStop(unit: Unit, item: Item): void
    {
        super.onStop(unit, item);

        const connectedUnit = unit.connectedUnit;

        if(!connectedUnit) return;

        if(connectedUnit.type !== UnitType.PET) return;

        connectedUnit.location.removeStatus(UnitStatusType.JUMP);

        unit.room.unitManager.processOutgoing(new UnitStatusComposer(connectedUnit));
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