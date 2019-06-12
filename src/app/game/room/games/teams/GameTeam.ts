import { Unit } from '../../../unit';
import { RoomGame } from '../RoomGame';
import { GameTeamIdentifier } from './GameTeamIdentifier';

export class GameTeam
{
    private _game: RoomGame;
    private _identifier: GameTeamIdentifier;

    private _units: Unit[];

    constructor(game: RoomGame, identifier: GameTeamIdentifier)
    {
        if(!(game instanceof RoomGame)) throw new Error('invalid_game');

        if(!identifier) throw new Error('invalid_identifier');

        this._game          = game;
        this._identifier    = identifier;

        this._units         = [];
    }

    public get game(): RoomGame
    {
        return this._game;
    }

    public get identifier(): GameTeamIdentifier
    {
        return this._identifier;
    }

    public get units(): Unit[]
    {
        return this._units;
    }
}