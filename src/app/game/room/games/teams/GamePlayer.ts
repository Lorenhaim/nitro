import { Unit, UnitEffect } from '../../../unit';
import { GameTeam } from './GameTeam';
import { GameTeamIdentifier } from './GameTeamIdentifier';

export class GamePlayer
{
    private _team: GameTeam;
    private _unit: Unit;

    private _score: number;

    constructor(team: GameTeam, unit: Unit)
    {
        if(!(team instanceof GameTeam) || !(unit instanceof Unit)) throw new Error('invalid_player');

        this._team  = team;
        this._unit  = unit;

        this.resetScore();
        this.setEffect();
    }

    public reset(): void
    {
        // reset player
        this.resetScore();
    }

    public resetScore(): void
    {
        this._score = 0;

        this._team.updateScore();
    }

    public adjustScore(amount: number = 1): void
    {
        this._score += amount;

        this._team.updateScore();
    }

    public setEffect(): void
    {
        if(!this._unit || !this._unit.room) return;

        this._unit.location.effect(<any> GameTeamIdentifier[this.team.color]);
    }

    public clearEffect(): void
    {
        if(!this._unit || !this._unit.room) return;

        this._unit.location.effect(UnitEffect.NONE);
    }

    public get team(): GameTeam
    {
        return this._team;
    }

    public get unit(): Unit
    {
        return this._unit;
    }

    public get score(): number
    {
        return this._score;
    }
}