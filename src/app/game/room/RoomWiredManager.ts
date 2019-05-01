import { Manager } from '../../common';
import { Item, WiredEffect, WiredTrigger } from '../item';
import { RoomTile } from './mapping';
import { Room } from './Room';

export class RoomWiredManager extends Manager
{
    private _room: Room;

    constructor(room: Room)
    {
        super('RoomWiredManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    protected async onInit(): Promise<void>
    {
    }
    
    protected async onDispose(): Promise<void>
    {
    }

    public getItemsByTrigger(trigger: typeof WiredTrigger): Item[]
    {
        if(!trigger) return null;

        const results: Item[] = [];

        const totalItems = this._room.itemManager.items.length;

        if(!totalItems) return null;

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._room.itemManager.items[i];

            if(!item) continue;

            const interaction = item.baseItem.interaction;

            if(!(interaction instanceof trigger)) continue;

            results.push(item);
        }

        if(results.length) return results;

        return null;
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

    public async processTrigger(trigger: typeof WiredTrigger, ...args: any[]): Promise<void>
    {
        if(!trigger) return;

        const triggers = this.getItemsByTrigger(trigger);

        if(!triggers) return;

        const totalTriggers = triggers.length;

        for(let i = 0; i < totalTriggers; i++)
        {
            const trigger = triggers[i];

            if(!trigger) continue;

            if(!this.canTrigger(trigger, ...args)) continue;

            const tile = trigger.getTile();

            if(!tile) continue;

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

        // validate stuff, cooldowns etc

        interaction.onTriggered(item, ...args);
    }

    public get room(): Room
    {
        return this._room;
    }
}