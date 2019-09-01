import { InteractionFreezeGeyser, InteractionFreezeTile, InteractionFreezeTimer } from '../../../item';
import { Position } from '../../../pathfinder';
import { Room } from '../../Room';
import { GameType } from '../GameType';
import { RoomGame } from '../RoomGame';
import { GamePlayer, GameTeamColor } from '../teams';
import { FreezeGeyser } from './FreezeGeyser';
import { FreezeTile } from './FreezeTile';

export class FreezeGame extends RoomGame
{
    private _geysers: FreezeGeyser[];

    constructor(room: Room)
    {
        super(GameType.FREEZE, room);

        this._geysers = [];

        this.loadData();
    }

    protected async onStart(): Promise<void>
    {
        this.loadData(true);
        
        this.timer.resetTimer();

        this.resetTeams();

        this.clearTiles();

        this.timer.startTimer();

        this.randomizeGeysers();
    }

    protected async onEnd(): Promise<void>
    {
        this.stopRandomizing();
        
        this.timer.resetTimer();

        const winner = this.getWinningTeam();

        if(winner) winner.win();

        this.clearTiles();
    }

    private loadData(tiles: boolean = false): void
    {
        this.loadTimer(InteractionFreezeTimer);
        this.loadGeysers();

        if(tiles) this.loadTiles(InteractionFreezeTile, FreezeTile);

        this.createTeams();
    }

    private createTeams(): void
    {
        this.createTeam(GameTeamColor.BLUE);
        this.createTeam(GameTeamColor.GREEN);
        this.createTeam(GameTeamColor.RED);
        this.createTeam(GameTeamColor.YELLOW);
    }
    
    private clearTiles(): void
    {
        const totalTiles = this.tiles.length;

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = <FreezeTile> this.tiles[i];

            if(!tile) continue;

            tile.resetTile();
        }
    }

    public markTileForPlayer(player: GamePlayer, position: Position): void
    {
        if(!player || !position) return;

        if(!this.isStarted) return;

        const tile = <FreezeTile> this.getTile(position);

        if(!tile) return;

        tile.markTile(player);
    }

    private randomizeGeysers(): void
    {
        const totalGeysers = this._geysers.length;

        if(!totalGeysers) return;

        for(let i = 0; i < totalGeysers; i++)
        {
            const geyser = this._geysers[i];

            if(!geyser) continue;

            geyser.startRandomizing();
        }
    }

    private stopRandomizing(): void
    {
        const totalGeysers = this._geysers.length;

        if(!totalGeysers) return;

        for(let i = 0; i < totalGeysers; i++)
        {
            const geyser = this._geysers[i];

            if(!geyser) continue;

            geyser.stopRandomizing();
        }
    }

    private loadGeysers(): void
    {
        this._geysers = [];

        if(!this.room) return;

        const items = this.room.itemManager.getItemsByInteraction(InteractionFreezeGeyser);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            this._geysers.push(new FreezeGeyser(item));
        }
    }
}