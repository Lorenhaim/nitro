import { Item, WiredEffect, WiredTrigger } from '../item';
import { RoomTile } from './mapping';
import { Room } from './Room';

export class RoomWiredManager
{
    private _room: Room;

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public getItemsByTrigger(trigger: typeof WiredTrigger): Item[]
    {
        return this._room.itemManager.getItemsByInteraction(<any> trigger);
    }

    public getEffectsByTile(tile: RoomTile): Item[]
    {
        if(!tile) return null;

        const results: Item[] = [];

        const totalItems = tile.items.length;

        if(!totalItems) return null;

        for(let i = 0; i < totalItems; i++)
        {
            const item = tile.items[i];

            if(!item) continue;

            const interaction = item.baseItem.interaction;

            if(!(interaction instanceof WiredEffect)) continue;

            results.push(item);
        }

        if(results.length) return results;

        return null;
    }

    public processTrigger(trigger: typeof WiredTrigger, ...args: any[]): void
    {
        if(!trigger) return;

        const triggers = this.getItemsByTrigger(trigger);

        if(!triggers) return;

        const totalTriggers = triggers.length;

        if(!totalTriggers) return;

        for(let i = 0; i < totalTriggers; i++)
        {
            const trigger = triggers[i];

            if(!trigger) continue;

            const tile = trigger.getTile();

            if(!tile) continue;

            if(!this.canTrigger(trigger, ...args)) continue;

            const effects = this.getEffectsByTile(tile);

            if(!effects) continue;

            const totalEffects = effects.length;

            if(!totalEffects) continue;

            for(let j = 0; j < totalEffects; j++)
            {
                const effect = effects[j];

                if(!effect) continue;

                this.doEffect(effect, ...args);
            }
        }
    }

    private canTrigger(trigger: Item, ...args: any[]): boolean
    {
        if(!trigger) return false;

        const interaction = <WiredTrigger> trigger.baseItem.interaction;

        if(interaction.canTrigger(trigger, ...args))
        {
            interaction.onTriggered(trigger);
            
            return true;
        }

        return false;
    }

    private doEffect(item: Item, ...args: any[]): void
    {
        if(!item) return;

        const interaction = <WiredEffect> item.baseItem.interaction;

        interaction.onTriggered(item, ...args);
    }

    public get room(): Room
    {
        return this._room;
    }
}