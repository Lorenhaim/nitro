import { Interaction } from '../../item';
import { Position } from '../../pathfinder';
import { Unit } from '../../unit';
import { Room } from '../Room';
import { GameTile } from './GameTile';
import { GameTimer } from './GameTimer';
import { GameType } from './GameType';
import { GamePlayer, GameTeam, GameTeamColor } from './teams';

export abstract class RoomGame
{
    private _type: GameType;
    private _room: Room;

    private _timer: GameTimer;
    private _tiles: GameTile[];
    private _teams: GameTeam[];

    private _isStarted: boolean;
    private _isStarting: boolean;

    private _isEnded: boolean;
    private _isEnding: boolean;

    constructor(type: GameType, room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._type          = type;
        this._room          = room;

        this._timer         = null;
        this._tiles         = [];
        this._teams         = [];

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

    public getTeam(color: GameTeamColor): GameTeam
    {
        if(color === null) return null;

        const instance = this.getActiveTeam(color);

        if(instance) return instance;

        return this.createTeam(color);
    }

    public getActiveTeam(color: GameTeamColor): GameTeam
    {
        if(color === null) return null;

        const totalTeams = this._teams.length;

        if(!totalTeams) return null;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this._teams[i];

            if(!team) continue;

            if(team.color !== color) continue;

            return team;
        }

        return null;
    }

    public getTeamForUnit(unit: Unit): GameTeam
    {
        if(!unit) return null;

        const totalTeams = this._teams.length;

        if(!totalTeams) return null;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this._teams[i];

            if(!team) continue;

            if(!team.hasPlayer(unit)) continue;

            return team;
        }

        return null;
    }

    public getPlayerForTeam(unit: Unit): GamePlayer
    {
        if(!unit) return null;

        const totalTeams = this._teams.length;

        if(!totalTeams) return null;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this._teams[i];

            if(!team) continue;

            const player = team.getPlayer(unit);

            if(!player) continue;

            return player;
        }

        return null;
    }

    public removePlayerFromTeam(unit: Unit): void
    {
        if(!unit) return null;

        const team = this.getTeamForUnit(unit);

        if(!team) return;

        team.removePlayer(unit);
    }

    public hasTeam(color: GameTeamColor): boolean
    {
        return this.getTeam(color) !== null;
    }

    protected createTeam(color: GameTeamColor): GameTeam
    {
        if(color === null) return null;

        const instance = this.getActiveTeam(color);

        if(instance) return instance;

        const team = new GameTeam(this, color);

        if(!team) return null;

        this._teams.push(team);

        return team;
    }

    public resetTeams(removePlayers: boolean = false): void
    {
        const totalTeams = this._teams.length;

        if(!totalTeams) return;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this._teams[i];

            if(!team) continue;
            
            if(removePlayers) team.resetPlayers();
            
            team.reset();
        }
    }

    public getWinningTeam(): GameTeam
    {
        const totalTeams = this.teams.length;

        if(!totalTeams) return null;

        let winner: GameTeam = null;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this.teams[i];

            if(!team) continue;

            if(winner)
            {
                if(team.score > winner.score)
                {
                    winner = team;

                    continue;
                }
            }
            else
            {
                winner = team;
            }
        }

        return winner;
    }

    public resetAllScores(): void
    {
        const totalTeams = this._teams.length;

        if(!totalTeams) return;

        for(let i = 0; i < totalTeams; i++)
        {
            const team = this._teams[i];

            if(!team) continue;

            team.resetScore();
        }
    }

    public getTile(position: Position): GameTile
    {
        if(!position) return null;

        const totalTiles = this.tiles.length;

        if(!totalTiles) return null;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this.tiles[i];

            if(!tile) continue;

            if(!tile.position.compare(position)) continue;

            return tile;
        }

        return null;
    }

    public hasTile(position: Position): boolean
    {
        return this.getTile(position) !== null;
    }

    protected loadTimer(interaction: typeof Interaction): void
    {
        this._timer = null;

        if(!this._room) return;

        const items = this._room.itemManager.getItemsByInteraction(interaction);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        this._timer = new GameTimer(this, items[0]);
    }

    protected loadTiles(interaction: typeof Interaction, type: typeof GameTile): void
    {
        this._tiles = [];

        if(!this._room) return;

        const items = this._room.itemManager.getItemsByInteraction(interaction);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            this._tiles.push(new type(item));
        }
    }

    public get type(): GameType
    {
        return this._type;
    }

    public get room(): Room
    {
        return this._room;
    }

    public get timer(): GameTimer
    {
        return this._timer;
    }

    public get tiles(): GameTile[]
    {
        return this._tiles;
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