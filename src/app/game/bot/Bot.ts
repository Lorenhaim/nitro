import { getManager } from 'typeorm';
import { BotEntity } from '../../database';
import { Nitro } from '../../Nitro';
import { OutgoingPacket, UnitChangeNameComposer, UnitInfoComposer } from '../../packets';
import { Room } from '../room';
import { PermissionList } from '../security';
import { Unit, UnitDance, UnitGender, UnitType } from '../unit';
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
            this._entity.x          = this._unit.location.position.x + 0;
            this._entity.y          = this._unit.location.position.y + 0;
            this._entity.z          = this._unit.location.position.z.toFixed();
            this._entity.direction  = this._unit.location.position.direction;
        }

        Nitro.gameScheduler.saveBot(this);
    }

    public async saveNow(): Promise<void>
    {
        Nitro.gameScheduler.removeBot(this);

        if(this._unit && this._unit.location.position)
        {
            this._entity.x          = this._unit.location.position.x + 0;
            this._entity.y          = this._unit.location.position.y + 0;
            this._entity.z          = this._unit.location.position.z.toFixed();
            this._entity.direction  = this._unit.location.position.direction;
        }

        await getManager().save(this._entity);
    }

    public isOwner(user: User): boolean
    {
        if(!user) return false;

        if(this._entity.userId === user.id) return true;

        if(user.hasPermission(PermissionList.ANY_BOT_OWNER)) return true;

        return false;
    }

    public updateName(user: User, name: string): void
    {
        if(!user || !name) return;

        if(!this.isOwner(user)) return;

        this._entity.name = name;

        this.save();

        if(this._unit.room) this._unit.room.unitManager.processOutgoing(new UnitChangeNameComposer(this._unit));
    }

    public updateFigure(user: User, figure: string, gender: UnitGender): void
    {
        if(!user || !figure || !gender) return;

        if(!this.isOwner(user)) return;

        this._entity.figure = figure;
        this._entity.gender = gender === UnitGender.MALE ? UnitGender.MALE : UnitGender.FEMALE;

        this.save();

        if(this._unit.room) this._unit.room.unitManager.processOutgoing(new UnitInfoComposer(this._unit));
    }

    public updateMotto(user: User, motto: string): void
    {
        if(!user || !motto) return;

        if(!this.isOwner(user)) return;

        this._entity.motto = motto;

        this.save();

        if(this._unit.room) this._unit.room.unitManager.processOutgoing(new UnitInfoComposer(this._unit));
    }

    public toggleDance(user: User): void
    {
        if(!user) return;

        if(!this.isOwner(user)) return;
        
        this._entity.dance = this._entity.dance > UnitDance.NONE ? UnitDance.NONE : UnitDance.NORMAL;

        this.save();

        if(this._unit.room) this._unit.location.dance(this._entity.dance);
    }

    public toggleRoaming(user: User): void
    {
        if(!user) return;

        if(!this.isOwner(user)) return;
        
        if(!this._unit.room) return;

        if(this._entity.freeRoam === '1')
        {
            this._entity.freeRoam = '0';

            this._unit.timer.stopRoamTimer();

            this._unit.location.stopWalking();
        }
        else
        {
            this._entity.freeRoam = '1';

            this._unit.location.roam();

            this._unit.timer.startRoamTimer();
        }

        this.save();
    }

    public setUser(user: User): void
    {
        if(!user) return;

        if(this._entity.userId === user.id) return;
        
        this._entity.userId = user.id;

        this.save();
    }

    public setRoom(room: Room): void
    {
        if(!room) return;
        
        if(this._entity.roomId === room.id) return;
        
        this._entity.roomId = room.id;

        this.save();
    }

    public clearRoom(): void
    {
        this._entity.roomId = null;

        this.save();
    }

    public parseInventoryData(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        return packet
            .writeInt(this._entity.id)
            .writeString(this._entity.name, this._entity.motto, this._entity.gender.toLocaleLowerCase(), this._entity.figure);
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get entity(): BotEntity
    {
        return this._entity;
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

    public set unit(unit: Unit)
    {
        this._unit = unit;
    }
}