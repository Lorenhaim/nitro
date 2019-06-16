import { InteractionBattleBanzaiTile, InteractionBattleBanzaiTimer, Item } from '../../item';
import { Position } from '../../pathfinder';
import { Room } from '../Room';
import { BanzaiTile } from './BanzaiTile';
import { RoomGame } from './RoomGame';
import { GamePlayer, GameTeam, GameTeamColor } from './teams';

export class BattleBanzaiGame extends RoomGame
{
    private _banzaiTimer: Item;
    private _banzaiTiles: BanzaiTile[];

    private _secondsAllowed: number;
    private _timerInterval: NodeJS.Timeout;

    constructor(room: Room)
    {
        super(room);

        this._banzaiTimer       = null;
        this._banzaiTiles       = [];

        this._secondsAllowed    = 0;
        this._timerInterval     = null;

        this.createTeams();

        this.loadBanzaiTimer();
        this.loadBanzaiTiles();
    }

    protected async onStart(): Promise<void>
    {
        this.resetTimer();

        this.resetTeams();

        this.setTiles();

        this.startTimer();
    }

    protected async onEnd(): Promise<void>
    {
        this.resetTimer();

        const winner = this.getWinningTeam();

        if(winner) winner.win();
        
        this.clearTiles();
    }

    private getWinningTeam(): GameTeam
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

    public getTile(position: Position): BanzaiTile
    {
        if(!position) return null;

        const totalTiles = this._banzaiTiles.length;

        if(!totalTiles) return null;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this._banzaiTiles[i];

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

    public markTileForPlayer(player: GamePlayer, position: Position): void
    {
        if(!player || !position) return;

        if(!this.isStarted) return;

        const tile = this.getTile(position);

        if(!tile) return;

        tile.markTile(player);
    }

    private stopTimer(): void
    {
        if(this._timerInterval) clearInterval(this._timerInterval);

        this._timerInterval = null;
    }

    private resetTimer(): void
    {
        this.stopTimer();

        this._banzaiTimer.setExtraData(0);
    }

    private startTimer(): void
    {
        this._secondsAllowed = 120;

        this.updateTimer();

        this._timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    private updateTimer(): void
    {
        this._banzaiTimer.setExtraData(this._secondsAllowed);

        this._secondsAllowed--;

        if(this._secondsAllowed === 0)
        {
            this.stopTimer();

            setTimeout(async () => await this.end(), 300);
        }
    }

    private setTiles(): void
    {
        const totalTiles = this._banzaiTiles.length;

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this._banzaiTiles[i];

            if(!tile) continue;

            tile.resetTileAndOpen();
        }
    }

    private clearTiles(): void
    {
        const totalTiles = this._banzaiTiles.length;

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this._banzaiTiles[i];

            if(!tile) continue;

            tile.resetTileAndClose();
        }
    }

    private createTeams(): void
    {
        this.createTeam(GameTeamColor.BLUE);
        this.createTeam(GameTeamColor.GREEN);
        this.createTeam(GameTeamColor.RED);
        this.createTeam(GameTeamColor.YELLOW);
    }

    private loadBanzaiTimer(): void
    {
        this._banzaiTimer = null;

        if(!this.room) return;

        const items = this.room.itemManager.getItemsByInteraction(InteractionBattleBanzaiTimer);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        this._banzaiTimer = items[0];
    }

    private loadBanzaiTiles(): void
    {
        this._banzaiTiles = [];

        if(!this.room) return;

        const items = this.room.itemManager.getItemsByInteraction(InteractionBattleBanzaiTile);

        if(!items) return;

        const totalItems = items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            this._banzaiTiles.push(new BanzaiTile(item));
        }
    }

    public get banzaiTiles(): BanzaiTile[]
    {
        return this._banzaiTiles;
    }
}