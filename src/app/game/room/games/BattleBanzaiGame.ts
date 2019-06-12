import { InteractionBattleBanzaiTile, Item } from '../../item';
import { Room } from '../Room';
import { RoomGame } from './RoomGame';

export class BattleBanzaiGame extends RoomGame
{
    private _banzaiTiles: Item[];

    constructor(room: Room)
    {
        super(room);

        this._banzaiTiles = [];

        this.loadBanzaiTiles();
    }

    protected async onStart(): Promise<void>
    {
        this.loadBanzaiTiles();

        this.resetTiles();
    }

    protected async onEnd(): Promise<void>
    {
        
    }

    private resetTiles(): void
    {
        const totalTiles = this._banzaiTiles.length;

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this._banzaiTiles[i];

            if(!tile) return;

            tile.setExtraData(1);
        }
    }

    private loadBanzaiTiles(): void
    {
        if(!this.room) return;

        const items = this.room.itemManager.getItemsByInteraction(InteractionBattleBanzaiTile);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            if(item.roomId !== this.room.id) continue;

            this._banzaiTiles.push(item);
        }
    }
}