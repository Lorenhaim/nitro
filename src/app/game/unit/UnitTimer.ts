import { Emulator } from '../../Emulator';
import { Unit } from './Unit';
import { UnitHandItem } from './UnitHandItem';

export class UnitTimer
{
    private _unit: Unit;

    private _idleTimer: NodeJS.Timeout;
    private _lookTimer: NodeJS.Timeout;
    private _handTimer: NodeJS.Timeout;

    constructor(unit: Unit)
    {
        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;

        this._idleTimer = null;
        this._lookTimer = null;
        this._handTimer = null;
    }

    public startTimers(): void
    {
        this.resetIdleTimer();
    }

    public stopTimers(): void
    {
        if(this._idleTimer) clearTimeout(this._idleTimer);
        if(this._lookTimer) clearTimeout(this._lookTimer);
        if(this._handTimer) clearTimeout(this._handTimer);

        if(this._unit.isIdle) this._unit.idle(false);
    }

    public startLookTimer(): void
    {
        if(this._lookTimer) clearTimeout(this._lookTimer);
        
        this._lookTimer = setTimeout(() =>
        {
            if(!this._unit.room) return;
            
            this._unit.location.position.headDirection = this._unit.location.position.direction;
            
            this._unit.needsUpdate = true;
        }, Emulator.config.game.unit.lookTimerMs);
    }

    public startHandTimer(): void
    {
        if(this._handTimer) clearTimeout(this._handTimer);
        
        this._handTimer = setTimeout(() => this._unit.location.hand(UnitHandItem.NONE), Emulator.config.game.unit.handItemMs);
    }

    public resetIdleTimer(): void
    {
        if(this._idleTimer) clearTimeout(this._idleTimer);

        this._unit.idle(false);
        
        this._idleTimer = setTimeout(() => this._unit.idle(true), Emulator.config.game.unit.idleTimerMs);
    }

    public stopIdleTimer(): void
    {
        if(this._idleTimer) clearTimeout(this._idleTimer);
    }

    public stopHandTimer(): void
    {
        if(this._handTimer) clearTimeout(this._handTimer);
    }
}