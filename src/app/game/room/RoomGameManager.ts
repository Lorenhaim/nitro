import { Manager } from '../../common';
import { Unit } from '../unit';
import { BattleBanzaiGame, FreezeGame, GamePlayer, GameTeam, GameType, RoomGame } from './games';
import { Room } from './Room';

export class RoomGameManager extends Manager
{
    private _room: Room;

    private _games: RoomGame[];

    constructor(room: Room)
    {
        super('RoomGameManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room  = room;

        this._games = [];
    }

    protected async onInit(): Promise<void>
    {
    }

    protected async onDispose(): Promise<void>
    {
        const totalGames = this._games.length;

        if(!totalGames) return;

        for(let i = 0; i < totalGames; i++)
        {
            const game = this._games[i];

            if(!game) continue;

            await game.end();
        }
    }

    public getGame(type: GameType): RoomGame
    {
        if(!type) return null;

        const instance = this.getActiveGame(type);

        if(instance) return instance;

        return this.createGame(type);
    }

    public getActiveGame(type: GameType): RoomGame
    {
        if(!type) return null;

        const totalGames = this._games.length;

        if(!totalGames) return null;

        for(let i = 0; i < totalGames; i++)
        {
            const game = this._games[i];

            if(!game) continue;

            if(game.type !== type) continue;

            return game;
        }

        return null;
    }

    public hasGame(type: GameType): boolean
    {
        return this.getGame(type) !== null;
    }

    private createGame(type: GameType): RoomGame
    {
        if(!type) return null;

        let instance = this.getActiveGame(type);

        if(instance) return instance;

        let game: RoomGame = null;

        if(type === GameType.BATTLE_BANZAI) game = new BattleBanzaiGame(this._room);

        else if(type === GameType.FREEZE) game = new FreezeGame(this._room);

        if(!game) return null;

        this._games.push(game);

        return game;
    }

    public getPlayer(unit: Unit): GamePlayer
    {
        if(!unit) return null;

        const totalGames = this._games.length;

        if(!totalGames) return null;

        for(let i = 0; i < totalGames; i++)
        {
            const game = this._games[i];

            if(!game) continue;

            const player = game.getPlayerForTeam(unit);

            if(!player) continue;

            return player;
        }

        return null;
    }

    public getTeam(unit: Unit): GameTeam
    {
        if(!unit) return null;

        const totalGames = this._games.length;

        if(!totalGames) return null;

        for(let i = 0; i < totalGames; i++)
        {
            const game = this._games[i];

            if(!game) continue;

            const team = game.getTeamForUnit(unit);

            if(!team) continue;

            return team;
        }

        return null;
    }

    public removeUnitFromGames(unit: Unit): void
    {
        if(!unit) return;

        const totalGames = this._games.length;

        if(!totalGames) return;

        for(let i = 0; i < totalGames; i++)
        {
            const game = this._games[i];

            if(!game) continue;

            game.removePlayerFromTeam(unit);
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get games(): RoomGame[]
    {
        return this._games;
    }
}