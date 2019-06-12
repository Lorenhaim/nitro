import { Manager } from '../../common';
import { RoomGame } from './games';
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

    public get room(): Room
    {
        return this._room;
    }

    public get games(): RoomGame[]
    {
        return this._games;
    }
}