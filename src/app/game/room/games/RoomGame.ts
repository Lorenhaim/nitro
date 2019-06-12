import { Room } from '../Room';
import { GameTeam, GameTeamIdentifier } from './teams';

export abstract class RoomGame
{
    private _room: Room;

    private _teams: GameTeam[];

    private _isStarted: boolean;
    private _isStarting: boolean;

    private _isEnded: boolean;
    private _isEnding: boolean;

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room  = room;

        this._teams = [];

        this._isStarted     = false;
        this._isStarting    = false;

        this._isEnded       = false;
        this._isEnding      = false;
    }

    public async start(): Promise<void>
    {
        if(this._isStarted || this._isStarting || this._isEnding) return;

        this._isStarting = true;

        await this.onStart();

        this._isStarted     = true;
        this._isStarting    = false;
        this._isEnded       = false;
    }

    public async end(): Promise<void>
    {
        if(this._isEnded || this._isEnding || this._isStarting) return;

        this._isEnding = true;

        await this.onEnd();

        this._isEnded     = true;
        this._isEnding    = false;
        this._isStarted   = false;
    }

    protected abstract async onStart(): Promise<void>;

    protected abstract async onEnd(): Promise<void>;

    public getTeam(identifier: GameTeamIdentifier): GameTeam
    {
        if(!identifier) return null;

        const totalTeams = this._teams.length;

        if(!totalTeams) return null;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this._teams[i];

            if(!team) continue;

            if(team.identifier !== identifier) continue;

            return team;
        }

        return null;
    }

    public hasTeam(identifier: GameTeamIdentifier): boolean
    {
        return this.getTeam(identifier) !== null;
    }

    public get room(): Room
    {
        return this._room;
    }

    public get teams(): GameTeam[]
    {
        return this._teams;
    }

    public get isStarted(): boolean
    {
        return this._isStarted;
    }
    
    public get isStarting(): boolean
    {
        return this._isStarting;
    }

    public get isEnded(): boolean
    {
        return this._isEnded;
    }

    public get isEnding(): boolean
    {
        return this._isEnding;
    }
}