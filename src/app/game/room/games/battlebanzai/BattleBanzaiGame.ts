import { shuffleArray } from '../../../../common';
import { InteractionBattleBanzaiSphere, InteractionBattleBanzaiTeleport, InteractionBattleBanzaiTile, InteractionBattleBanzaiTimer } from '../../../item';
import { Position } from '../../../pathfinder';
import { Room } from '../../Room';
import { GameType } from '../GameType';
import { RoomGame } from '../RoomGame';
import { GamePlayer, GameTeamColor } from '../teams';
import { BanzaiSphere } from './BanzaiSphere';
import { BanzaiTeleport } from './BanzaiTeleport';
import { BanzaiTile } from './BanzaiTile';

export class BattleBanzaiGame extends RoomGame
{
    private _spheres: BanzaiSphere[];
    private _teleports: BanzaiTeleport[];

    constructor(room: Room)
    {
        super(GameType.BATTLE_BANZAI, room);

        this._spheres   = [];
        this._teleports = [];

        this.loadData();
    }

    protected async onStart(): Promise<void>
    {
        this.loadData(true);
        
        this.timer.resetTimer();

        this.resetTeams();

        this.setTiles();
        
        this.timer.startTimer();
    }

    protected async onEnd(): Promise<void>
    {
        this.timer.resetTimer();

        const winner = this.getWinningTeam();

        if(winner) winner.win();
        
        this.clearTiles();
    }

    private setSphereColor(player: GamePlayer): void
    {
        const totalSpheres = this._spheres.length;

        if(!totalSpheres) return;

        for(let i = 0; i < totalSpheres; i++)
        {
            const sphere = this._spheres[i];

            if(!sphere) continue;

            sphere.setColor(player.team.color);
        }
    }

    private loadData(tiles: boolean = false): void
    {
        this.loadTimer(InteractionBattleBanzaiTimer);

        this.loadSpheres();
        this.loadTeleports();

        if(tiles) this.loadTiles(InteractionBattleBanzaiTile, BanzaiTile);

        this.createTeams();
    }

    private createTeams(): void
    {
        this.createTeam(GameTeamColor.BLUE);
        this.createTeam(GameTeamColor.GREEN);
        this.createTeam(GameTeamColor.RED);
        this.createTeam(GameTeamColor.YELLOW);
    }

    public getTeleport(position: Position): BanzaiTeleport
    {
        if(!position) return null;

        const totalTeleports = this._teleports.length;

        if(!totalTeleports) return null;

        for(let i = 0; i < totalTeleports; i++)
        {
            const teleport = this._teleports[i];

            if(!teleport) continue;

            if(!teleport.item.position.compare(position)) continue;

            return teleport;
        }

        return null;
    }

    private setTiles(): void
    {
        const totalTiles = this.tiles.length;

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = <BanzaiTile> this.tiles[i];

            if(!tile) continue;

            tile.resetTileAndOpen();
        }
    }

    private clearTiles(): void
    {
        const totalTiles = this.tiles.length;

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = <BanzaiTile> this.tiles[i];

            if(!tile) continue;

            tile.resetTileAndClose();
        }
    }

    public markTileForPlayer(player: GamePlayer, position: Position): void
    {
        if(!player || !position) return;

        if(!this.isStarted) return;

        const tile = <BanzaiTile> this.getTile(position);

        if(!tile) return;

        tile.markTile(player);

        this.setSphereColor(player);
    }

    public triggerTeleport(player: GamePlayer, position: Position): void
    {
        if(!player || !position) return;

        const teleport = this.getTeleport(position);

        if(!teleport) return;

        const randomTeleport = this._teleports.length > 1 ? shuffleArray(this._teleports)[0] : this._teleports[0];

        if(!randomTeleport) return;

        if(randomTeleport === teleport) return this.triggerTeleport(player, position);

        teleport.teleportPlayer(player, randomTeleport);
    }

    private loadSpheres(): void
    {
        this._teleports = [];

        if(!this.room) return;

        const items = this.room.itemManager.getItemsByInteraction(InteractionBattleBanzaiSphere);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            this._spheres.push(new BanzaiSphere(this, item));
        }
    }

    private loadTeleports(): void
    {
        this._teleports = [];

        if(!this.room) return;

        const items = this.room.itemManager.getItemsByInteraction(InteractionBattleBanzaiTeleport);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            this._teleports.push(new BanzaiTeleport(this, item));
        }
    }

    public get spheres(): BanzaiSphere[]
    {
        return this._spheres;
    }

    public get teleports(): BanzaiTeleport[]
    {
        return this._teleports;
    }
}