import { Interaction, InteractionBattleBanzaiGateBlue, InteractionBattleBanzaiGateGreen, InteractionBattleBanzaiGateRed, InteractionBattleBanzaiGateYellow, InteractionBattleBanzaiScoreboardBlue, InteractionBattleBanzaiScoreboardGreen, InteractionBattleBanzaiScoreboardRed, InteractionBattleBanzaiScoreboardYellow, Item } from '../../../item';
import { Unit, UnitAction, UnitEffect } from '../../../unit';
import { BanzaiTile } from '../BanzaiTile';
import { BattleBanzaiGame } from '../BattleBanzaiGame';
import { RoomGame } from '../RoomGame';
import { GamePlayer } from './GamePlayer';
import { GameTeamColor } from './GameTeamIdentifier';

export class GameTeam
{
    private _game: RoomGame;
    private _color: GameTeamColor;
    private _score: number;

    private _lockedTiles: BanzaiTile[];

    private _flickerActive: boolean;
    private _flickerCount: number;
    private _flickerInterval: NodeJS.Timeout;

    private _players: GamePlayer[];
    private _maxPlayers: number;

    private _gate: Item;
    private _scoreboard: Item;

    constructor(game: RoomGame, color: GameTeamColor)
    {
        if(!(game instanceof RoomGame)) throw new Error('invalid_game');

        if(color === null) throw new Error('invalid_identifier');

        this._game          = game;
        this._color         = color;

        this._players       = [];
        this._maxPlayers    = 5;

        this.loadGate();
        this.loadScoreboard();

        this.reset();
    }

    public reset(): void
    {
        this.clearLockedTiles();
        this.resetFlickering();
        this.resetScore();
        this.updateGate();
    }

    public resetFlickering(): void
    {
        if(this._flickerInterval) clearInterval(this._flickerInterval);

        this._flickerActive     = false;
        this._flickerCount      = 0;
        this._flickerInterval   = null;
    }

    private clearLockedTiles(): void
    {
        this._lockedTiles   = [];
    }

    public resetPlayers(): void
    {
        if(this._players.length) for(let i = this._players.length - 1; i >= 0; i--) this.removePlayerAtIndex(i);

        this._players       = [];
        this._maxPlayers    = 5;
    }

    public getPlayer(unit: Unit): GamePlayer
    {
        if(!unit) return null;

        const totalPlayers = this._players.length;

        if(!totalPlayers) return null;
        
        for(let i = 0; i < totalPlayers; i++)
        {
            const player = this._players[i];

            if(!player) continue;

            if(player.unit !== unit) continue;

            return player;
        }

        return null;
    }

    public hasPlayer(unit: Unit): boolean
    {
        return this.getPlayer(unit) !== null;
    }

    public addPlayer(unit: Unit): void
    {
        if(!unit) return;

        if(this._players.length === this._maxPlayers) return;

        const activeTeam = this.game.getTeamForUnit(unit);

        if(activeTeam) return activeTeam.removePlayer(unit);

        const activePlayer = this.getPlayer(unit);

        if(activePlayer) return;

        if(this.game.isStarted) return;

        const player = new GamePlayer(this, unit);

        if(!player) return;

        this._players.push(player);

        this.updateGate();
    }

    public removePlayer(unit: Unit): void
    {
        if(!unit) return;

        const totalPlayers = this._players.length;

        if(!totalPlayers) return;

        for(let i = 0; i < totalPlayers; i++)
        {
            const player = this._players[i];

            if(!player) continue;

            if(player.unit !== unit) continue;

            this.removePlayerAtIndex(i);
        }
    }

    private removePlayerAtIndex(i: number): void
    {
        if(i === -1) return;

        const player = this._players[i];

        if(!player) return;

        player.reset();

        player.unit.location.effect(UnitEffect.NONE);

        this._players.splice(i, 1);

        this.updateGate();
    }

    public resetScore(): void
    {
        this._score = 0;

        const totalPlayers = this._players.length;

        if(totalPlayers)
        {
            for(let i = 0; i < totalPlayers; i++)
            {
                const player = this._players[i];

                if(!player) continue;

                player.resetScore();
            }
        }

        this.updateScore();
    }

    public updateScore(): void
    {
        this._score = 0;
        
        const totalPlayers = this._players.length;

        if(totalPlayers)
        {
            for(let i = 0; i < totalPlayers; i++)
            {
                const player = this._players[i];

                if(!player) continue;

                this._score += player.score;
            }
        }

        this.updateScoreboard();
    }

    private updateGate(): void
    {
        if(!(this._game instanceof BattleBanzaiGame)) return;

        if(!this._gate) return;

        this._gate.setExtraData(this._players.length);
    }

    private updateScoreboard(): void
    {
        if(!(this._game instanceof BattleBanzaiGame)) return;

        if(!this._scoreboard) return;

        this._scoreboard.setExtraData(this._score);
    }

    public win(): void
    {
        const totalPlayers = this._players.length;

        if(!totalPlayers) return;

        for(let i = 0; i < totalPlayers; i++)
        {
            const player = this._players[i];

            if(!player) continue;

            if(!player.unit) continue;

            player.unit.location.action(UnitAction.WAVE);
        }

        this.startFlickering();
    }

    public startFlickering(): void
    {
        this.resetFlickering();

        this._flickerInterval = setInterval(() => this.flickerLockedTiles(), 500);
    }

    private flickerLockedTiles(): void
    {
        let state: number = 0;

        if(this._flickerActive)
        {
            state = (this._color * 3) + 5;

            this._flickerActive = false;
        }
        else this._flickerActive = true;

        this.processFlicker(state);

        if(this._flickerCount === 5) return this.resetFlickering();

        this._flickerCount++;
    }

    private processFlicker(state: number): void
    {
        const totalLocked = this._lockedTiles.length;

        if(!totalLocked) return;

        for(let i = 0; i < totalLocked; i++)
        {
            const locked = this._lockedTiles[i];

            if(!locked) continue;

            locked.item.setExtraData(state);
        }
    }

    private loadGate(): void
    {
        this._gate = null;

        if(!(this._game instanceof BattleBanzaiGame)) return;

        let interaction: typeof Interaction = null;

        if(this._color === GameTeamColor.BLUE) interaction = InteractionBattleBanzaiGateBlue;
        else if(this._color === GameTeamColor.GREEN) interaction = InteractionBattleBanzaiGateGreen;
        else if(this._color === GameTeamColor.RED) interaction = InteractionBattleBanzaiGateRed;
        else if(this._color === GameTeamColor.YELLOW) interaction = InteractionBattleBanzaiGateYellow;

        if(!interaction) return;

        const items = this._game.room.itemManager.getItemsByInteraction(interaction);

        if(!items) return;

        if(!items.length) return;

        this._gate = items[0];
    }

    private loadScoreboard(): void
    {
        this._scoreboard = null;

        if(!(this._game instanceof BattleBanzaiGame)) return;

        let interaction: typeof Interaction = null;

        if(this._color === GameTeamColor.BLUE) interaction = InteractionBattleBanzaiScoreboardBlue;
        else if(this._color === GameTeamColor.GREEN) interaction = InteractionBattleBanzaiScoreboardGreen;
        else if(this._color === GameTeamColor.RED) interaction = InteractionBattleBanzaiScoreboardRed;
        else if(this._color === GameTeamColor.YELLOW) interaction = InteractionBattleBanzaiScoreboardYellow;

        if(!interaction) return;

        const items = this._game.room.itemManager.getItemsByInteraction(interaction);

        if(!items) return;

        if(!items.length) return;

        this._scoreboard = items[0];
    }

    public get game(): RoomGame
    {
        return this._game;
    }

    public get color(): GameTeamColor
    {
        return this._color;
    }

    public get score(): number
    {
        return this._score;
    }

    public get lockedTiles(): BanzaiTile[]
    {
        return this._lockedTiles;
    }

    public get players(): GamePlayer[]
    {
        return this._players;
    }
}