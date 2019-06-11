import { NumberHelper } from '../../common';
import { Nitro } from '../../Nitro';
import { Unit } from './Unit';
import { UnitHandItem } from './UnitHandItem';

export class UnitTimer
{
    private _unit: Unit;

    private _idleTimer: NodeJS.Timeout;
    private _lookTimer: NodeJS.Timeout;
    private _handTimer: NodeJS.Timeout;
    private _roamTimer: NodeJS.Timeout;

    constructor(unit: Unit)
    {
        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;

        this._idleTimer = null;
        this._lookTimer = null;
        this._handTimer = null;
        this._roamTimer = null;
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
        if(this._roamTimer) clearTimeout(this._roamTimer);

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
        }, Nitro.config.game.unit.lookTimerMs);
    }

    public startHandTimer(): void
    {
        if(this._handTimer) clearTimeout(this._handTimer);
        
        this._handTimer = setTimeout(() => this._unit.location.hand(UnitHandItem.NONE), Nitro.config.game.unit.handItemMs);
    }

    public startRoamTimer(): void
    {
        if(this._roamTimer) clearTimeout(this._roamTimer);

        if(!this._unit.room) return;
        
        this._roamTimer = setTimeout(() =>
        {
            this._unit.location.roam();

            this.startRoamTimer();
        }, NumberHelper.randomNumber(1, Nitro.config.game.unit.roamTimerMs));
    }

    public resetIdleTimer(): void
    {
        if(this._idleTimer) clearTimeout(this._idleTimer);

        this._unit.idle(false);
        
        this._idleTimer = setTimeout(() => this._unit.idle(true), Nitro.config.game.unit.idleTimerMs);
    }

    public stopIdleTimer(): void
    {
        if(this._idleTimer) clearTimeout(this._idleTimer);
    }

    public stopHandTimer(): void
    {
        if(this._handTimer) clearTimeout(this._handTimer);
    }

    public stopRoamTimer(): void
    {
        if(this._roamTimer) clearTimeout(this._roamTimer);
    }
}