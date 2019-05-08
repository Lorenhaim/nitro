import { BotEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { OutgoingPacket, UnitInfoComposer } from '../../packets';
import { Room } from '../room';
import { Unit, UnitDance, UnitType } from '../unit';
import { User } from '../user';

export class Bot
{
    private _entity: BotEntity;

    private _unit: Unit;

    constructor(entity: BotEntity)
    {
        if(!(entity instanceof BotEntity)) throw new Error('invalid_entity');

        this._entity = entity;

        this._unit = new Unit(UnitType.BOT, this);
    }

    public save(): void
    {
        if(this._unit && this._unit.location.position)
        {
            this._entity.x          = this._unit.location.position.x || 0;
            this._entity.y          = this._unit.location.position.y || 0;
            this._entity.z          = this._unit.location.position.z.toString() || '0.00';
            this._entity.direction  = this._unit.location.position.direction || 0;
        }

        Emulator.gameScheduler.saveBot(this._entity);
    }

    public savePosition(): void
    {
        if(this._unit && this._unit.location.position)
        {
            const position = this._unit.location.position.copy();

            this._entity.x          = position.x || 0;
            this._entity.y          = position.y || 0;
            this._entity.z          = position.z.toString() || '0.00';
            this._entity.direction  = position.direction || 0;

            this.save();
        }
    }

    public updateFigure(figure: string, gender: 'M' | 'F'): void
    {
        this._entity.figure = figure;
        this._entity.gender = gender === 'M' ? 'M' : 'F';

        this.save();

        if(this._unit.room) this._unit.room.unitManager.processOutgoing(new UnitInfoComposer(this._unit));
    }

    public updateDance(dance: UnitDance): void
    {
        this._entity.dance = dance;

        this.save();

        if(this._unit.room) this._unit.location.dance(dance);
    }

    public updateRoaming(status: boolean): void
    {
        this._entity.freeRoam = status ? '1' : '0';

        this.save();

        if(status)
        {
            if(this._unit && this._unit.room)
            {
                this._unit.location.roam();

                this._unit.timer.startRoamTimer();
            }
        }
        else
        {
            if(this._unit && this._unit.room)
            {
                this._unit.timer.stopRoamTimer();
            }
        }
    }

    public setUser(user: User): void
    {
        if(!user) return;
        
        if(this._entity.userId !== user.id)
        {
            this._entity.userId = user.id;

            this.save();
        }
    }

    public setRoom(room: Room): void
    {
        if(!room) return;
        
        if(this._entity.roomId !== room.id)
        {
            this._entity.roomId = room.id;

            this.save();
        }
    }

    public clearRoom(): void
    {
        this._entity.roomId = null;

        this.save();
    }

    public clearUser(): void
    {
        this._entity.userId = null;

        this.save();
    }

    public parseInventoryData(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        return packet
            .writeInt(this._entity.id)
            .writeString(this._entity.name)
            .writeString(this._entity.motto)
            .writeString(this._entity.gender.toLocaleLowerCase())
            .writeString(this._entity.figure);
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get roomId(): number
    {
        return this._entity.roomId;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get motto(): string
    {
        return this._entity.motto;
    }

    public get gender(): 'M' | 'F'
    {
        return this._entity.gender;
    }

    public get figure(): string
    {
        return this._entity.figure;
    }

    public get dance(): UnitDance
    {
        return parseInt(<any> this._entity.dance);
    }

    public get freeRoam(): boolean
    {
        return this._entity.freeRoam === '1';
    }

    public get unit(): Unit
    {
        return this._unit;
    }
}