import { Item } from '../../item';
import { RoomGame } from './RoomGame';

export class GameTimer
{
    private _game: RoomGame;
    private _item: Item;

    private _secondsAllowed: number;
    private _timerInterval: NodeJS.Timeout;

    constructor(game: RoomGame, item: Item)
    {
        if(!(game instanceof RoomGame)) throw new Error('invalid_game');

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._game              = game;
        this._item              = item;

        this._secondsAllowed    = 0;
        this._timerInterval     = null;
    }

    public resetTimer(): void
    {
        this.stopTimer();

        this._item.setExtraData(0);
    }

    public stopTimer(): void
    {
        if(this._timerInterval) clearInterval(this._timerInterval);

        this._timerInterval = null;
    }

    public startTimer(): void
    {
        this._secondsAllowed = 60;

        this.updateTimer();

        this._timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    private updateTimer(): void
    {
        this._item.setExtraData(this._secondsAllowed);

        this._secondsAllowed--;

        if(this._secondsAllowed === 0) this._game.end();
    }

    public get game(): RoomGame
    {
        return this._game;
    }

    public get item(): Item
    {
        return this._item;
    }
}