import { InteractionBattleBanzaiTile, Item } from '../../item';
import { FloodFill, Position } from '../../pathfinder';
import { BanzaiTileColor } from './BanzaiTileColor';
import { GamePlayer } from './teams';

export class BanzaiTile
{
    private _item: Item;

    private _color: BanzaiTileColor;
    private _isLocked: boolean;

    constructor(item: Item)
    {
        if(!(item instanceof Item)) throw new Error('invalid_item');

        if(!(item.baseItem.interaction instanceof InteractionBattleBanzaiTile)) throw new Error('invalid_interaction');

        this._item = item;

        this.resetTile();
    }

    public resetTileAndOpen(): void
    {
        this.resetTile();

        this._item.setExtraData(1);
    }

    public resetTileAndClose(): void
    {
        this.resetTile();

        if(parseInt(this._item.extraData) <= 2) this._item.setExtraData(0);
    }

    public resetTile(): void
    {
        this._color     = null;
        this._isLocked  = false;
    }

    public markTile(player: GamePlayer): void
    {
        if(!player) return;

        if(this._isLocked) return;

        let state = parseInt(this._item.extraData);

        this.setColor(player);

        const check = state - (this._color * 3);

        if(check === 3 || check === 4)
        {
            state++;

            if(state % 3 === 2) return this.lockTile(player);
        }
        else
        {
            state = (player.team.color * 3) + 3;
        }
        
        this._item.setExtraData(state);
    }

    private lockTile(player: GamePlayer, checkFill: boolean = true): void
    {
        if(!player) return;

        if(this._isLocked) return;

        this.setColor(player);

        this._isLocked = true;

        this._item.setExtraData(2 + (this._color * 3) + 3);

        player.team.lockedTiles.push(this);

        if(checkFill) this.checkFill(player);

        player.adjustScore(1);
    }

    private checkFill(player: GamePlayer): void
    {
        if(!player) return;

        const neighbours = FloodFill.neighbours(player.team.game, this.position);

        if(!neighbours) return;

        const totalNeighbours = neighbours.length;

        if(!totalNeighbours) return;

        for(let i = 0; i < totalNeighbours; i++)
        {
            const neighbour = neighbours[i];

            if(!neighbour) continue;

            if(neighbour.isLocked || neighbour.isDisabled) continue;

            const filledTiles = FloodFill.getFill(player, neighbour);

            if(!filledTiles) continue;

            const totalFilled = filledTiles.length;

            if(!totalFilled) continue;

            for(let j = 0; j < totalFilled; j++)
            {
                const filled = filledTiles[j];

                if(!filled) continue;

                if(filled.isLocked) continue;

                filled.lockTile(player, false);
            }
        }
    }

    private setColor(player: GamePlayer): void
    {
        this._color = <any> player.team.color;
    }

    public get position(): Position
    {
        return this._item.position;
    }

    public get item(): Item
    {
        return this._item;
    }

    public get color(): BanzaiTileColor
    {
        return this._color;
    }

    public get isClear(): boolean
    {
        return this._item.extraData === '1';
    }

    public get isLocked(): boolean
    {
        return this._isLocked;
    }

    public get isDisabled(): boolean
    {
        return this._item.extraData === '0';
    }
}