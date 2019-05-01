import { OutgoingPacket } from '../../../packets';
import { AffectedPositions, Position } from '../../pathfinder';
import { Unit, UnitEffect } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { OnClick, OnEnter, OnLeave, OnMove, OnStep, OnStop, ParseExtraData } from './actions';
import { Interaction } from './Interaction';

export class InteractionDefault extends Interaction implements OnClick, OnEnter, OnLeave, OnMove, OnStep, OnStop, ParseExtraData
{
    constructor(name: string = null)
    {
        super(name || 'default');
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(unit && item)
        {
            const room = item.room;

            if(room)
            {
                const totalStates = item.baseItem.totalStates;

                if(totalStates)
                {
                    const currentState  = item.extraData ? parseInt(item.extraData) : 0;
                    const nextState     = (currentState + 1) % item.baseItem.totalStates;

                    item.setExtraData(nextState);
                }
            }
        }
    }

    public onEnter(unit: Unit, item: Item): void
    {
        if(unit && item)
        {
            if(item.baseItem.hasEffect)
            {
                if(unit.location.effectType)
                {
                    if(item.baseItem.effectIds.indexOf(unit.location.effectType) === -1)
                    {
                        const effectId = item.baseItem.getRandomEffect(unit.user.details.gender);

                        if(effectId) unit.location.effect(effectId);
                    }
                }
                else
                {
                    const effectId = item.baseItem.getRandomEffect(unit.user.details.gender);

                    if(effectId) unit.location.effect(effectId);
                }
            }
        }
    }

    public onLeave(unit: Unit, item: Item, positionNext: Position = null): void
    {
        if(unit && item)
        {
            const room = item.room;

            if(room)
            {
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
        }
    }

    public onMove(user: User, item: Item): void
    {
        console.log('moved');
    }

    public onStep(unit: Unit, item: Item): void
    {
        console.log('stepped');
    }

    public onStop(unit: Unit, item: Item): void
    {        
        if(unit && item)
        {
            if(item.baseItem.hasEffect)
            {
                if(unit.location.effectType)
                {
                    if(item.baseItem.effectIds.indexOf(unit.location.effectType) === -1)
                    {
                        const effectId = item.baseItem.getRandomEffect(unit.user.details.gender);

                        if(effectId) unit.location.effect(effectId);
                    }
                }
                else
                {
                    const effectId = item.baseItem.getRandomEffect(unit.user.details.gender);

                    if(effectId) unit.location.effect(effectId);
                }
            }
             
            if(item.baseItem.canSit)
            {
                unit.location.sit(true, item.baseItem.stackHeight, item.position.direction);
            }

            else if(item.baseItem.canLay)
            {
                const pillowPositions = AffectedPositions.getPillowPositions(item);

                if(pillowPositions)
                {
                    const totalPositions = pillowPositions.length;

                    if(totalPositions)
                    {
                        for(let i = 0; i < totalPositions; i++)
                        {
                            const pillowPosition = pillowPositions[i];

                            if(pillowPosition.compare(unit.location.position))
                            {
                                unit.location.lay(true, item.baseItem.stackHeight, item.position.direction);
                            }
                        }
                    }
                }
            }
        }
    }

    public parseExtraData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(item && packet)
        {
            packet.writeInt(item.limitedData !== '0:0' ? 256 : 0);
            packet.writeString(item.extraData);
            
            return packet;
        }

        return null;
    }
}