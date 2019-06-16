import { Manager } from '../../common';
import { Unit } from '../unit';
import { BattleBanzaiGame, RoomGame } from './games';
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

    public getGame(type: typeof RoomGame): RoomGame
    {
        if(!type) return null;

        const instance = this.getActiveGame(type);

        if(instance) return instance;

        return this.createGame(type);
    }

    public getActiveGame(type: typeof RoomGame): RoomGame
    {
        if(!type) return null;

        const totalGames = this._games.length;

        if(!totalGames) return null;

        for(let i = 0; i < totalGames; i++)
        {
            const game = this._games[i];

            if(!game) continue;

            if(!(game instanceof type)) continue;

            return game;
        }

        return null;
    }

    public hasGame(type: typeof RoomGame): boolean
    {
        return this.getGame(type) !== null;
    }

    private createGame(type: typeof RoomGame): RoomGame
    {
        if(!type) return null;

        let instance = this.getActiveGame(type);

        if(instance) return instance;

        let game: RoomGame = null;

        if(type === BattleBanzaiGame) game = new BattleBanzaiGame(this._room);

        if(!game) return null;

        this._games.push(game);

        return game;
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