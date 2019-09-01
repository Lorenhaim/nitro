import { InteractionBattleBanzaiSphere, Item } from '../../../item';
import { Position } from '../../../pathfinder';
import { GameTeamColor } from '../teams';
import { BattleBanzaiGame } from './BattleBanzaiGame';

export class BanzaiSphere
{
    private _game: BattleBanzaiGame;
    private _item: Item;

    constructor(game: BattleBanzaiGame, item: Item)
    {
        if(!(game instanceof BattleBanzaiGame)) throw new Error('invalid_game');

        if(!(item instanceof Item)) throw new Error('invalid_item');

        if(!(item.baseItem.interaction instanceof InteractionBattleBanzaiSphere)) throw new Error('invalid_interaction');

        this._game  = game;
        this._item  = item;
    }

    public setColor(color: GameTeamColor)
    {
        this._item.setExtraData(color + 3);
    }

    public clearSphere(): void
    {
        this._item.setExtraData(0);
    }

    public get game(): BattleBanzaiGame
    {
        return this._game;
    }

    public get item(): Item
    {
        return this._item;
    }

    public get position(): Position
    {
        return this._item.position;
    }
}