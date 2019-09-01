import { OutgoingPacket } from '../../../packets';
import { Position } from '../../pathfinder';
import { Unit, UnitEffect, UnitType } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { BeforeStep, OnClick, OnEnter, OnLeave, OnMove, OnStep, OnStop, ParseExtraData } from './actions';
import { Interaction } from './Interaction';

export class InteractionDefault extends Interaction implements OnClick, OnEnter, OnLeave, OnMove, OnStep, OnStop, ParseExtraData, BeforeStep
{
    constructor(name: string = null)
    {
        super(name || 'default');
    }

    public onClick(unit: Unit, item: Item, toggleState: boolean = true): void
    {
        if(!unit || !item) return;

        const room = item.room;
        
        if(!room) return;

        if(toggleState) item.toggleState();
    }

    public onEnter(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        if(item.baseItem.hasEffect)
        {
            const gender = unit.type === UnitType.USER ? unit.user.details.gender : null;

            const effectId = item.baseItem.getRandomEffect(gender);

            if(effectId)
            {
                if(unit.location.effectType)
                {
                    if(item.baseItem.effectIds.indexOf(unit.location.effectType) === -1)
                    {
                        if(effectId) unit.location.effect(effectId);
                    }
                }
                else
                {
                    if(effectId) unit.location.effect(effectId);
                }
            }
        }
    }

    public onLeave(unit: Unit, item: Item, positionNext: Position = null): void
    {
        if(!unit || !item) return;
        
        const room = item.room;

        if(!room) return;
        
        if(item.baseItem.hasEffect)
        {
            if(positionNext)
            {
                const nextTile = room.map.getTile(positionNext);

                if(nextTile && nextTile.highestItem)
                {
                    if(nextTile.highestItem.baseItem !== item.baseItem) unit.location.effect(UnitEffect.NONE);
                }
                else unit.location.effect(UnitEffect.NONE);
            }
            else unit.location.effect(UnitEffect.NONE);
        }
    }

    public onMove(user: User, item: Item): void {}

    public onStep(unit: Unit, item: Item): void {}

    public beforeStep(unit: Unit, item: Item): void {}

    public onStop(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;
        
        if(item.baseItem.hasEffect)
        {
            const gender = unit.type === UnitType.USER ? unit.user.details.gender : null;

            const effectId = item.baseItem.getRandomEffect(gender);

            if(effectId)
            {
                if(unit.location.effectType)
                {
                    if(item.baseItem.effectIds.indexOf(unit.location.effectType) === -1)
                    {
                        if(effectId) unit.location.effect(effectId);
                    }
                }
                else
                {
                    if(effectId) unit.location.effect(effectId);
                }
            }
        }
             
        if(item.baseItem.canSit)
        {
            unit.location.sit(true, item.baseItem.stackHeight, item.position.direction);
        }

        else if(item.baseItem.canLay)
        {
            const pillow = item.room.map.convertToValidPillow(unit, unit.location.position, item);

            if(pillow)
            {
                if(!pillow.compare(unit.location.position))
                {

                    unit.location.position.x = pillow.x;
                    unit.location.position.y = pillow.y;
                }

                unit.location.lay(true, item.baseItem.stackHeight, item.position.direction);
            }
        }
    }

    public parseExtraData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;
        
        packet.writeInt(item.limitedData !== '0:0' ? 256 : 0);
        packet.writeString(item.extraData);
            
        return packet;
    }

    private toggleState(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const room = item.room;

        if(!room) return;

        const totalStates = item.baseItem.totalStates;

        if(!totalStates) return;

        const currentState  = item.extraData ? parseInt(item.extraData) : 0;
        const nextState     = (currentState + 1) % item.baseItem.totalStates;

        item.setExtraData(nextState);
    }
}