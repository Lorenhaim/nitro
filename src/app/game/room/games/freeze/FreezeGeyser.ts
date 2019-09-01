import { NumberHelper } from '../../../../common';
import { Nitro } from '../../../../Nitro';
import { InteractionFreezeGeyser, Item } from '../../../item';

export class FreezeGeyser
{
    private _item: Item;

    private _randomTimeout: NodeJS.Timeout;

    constructor(item: Item)
    {
        if(!(item instanceof Item)) throw new Error('invalid_item');

        if(!(item.baseItem.interaction instanceof InteractionFreezeGeyser)) throw new Error('invalid_interaction');

        this._item          = item;

        this._randomTimeout = null;
    }

    public open(): void
    {
        this._item.setExtraData(1);
    }

    public close(): void
    {
        this._item.setExtraData(0);

        setTimeout(() => this.open(), 5000);
    }

    public randomlyClose(): void
    {
        if(this._item.extraData === '0') return;
        
        const chance = Math.random() > 0.5 ? 0 : 1;

        if(chance === 0) this.close();
    }

    public startRandomizing(): void
    {
        this.stopRandomizing();

        this._randomTimeout = setInterval(() => this.randomlyClose(), NumberHelper.randomNumber(1, Nitro.config.game.rooms.games.freeze.geyserRandomMs));
    }

    public stopRandomizing(): void
    {
        if(this._randomTimeout) clearInterval(this._randomTimeout);
    }
}