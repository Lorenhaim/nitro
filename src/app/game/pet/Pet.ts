import { getManager } from 'typeorm';
import { PetEntity } from '../../database';
import { Nitro } from '../../Nitro';
import { OutgoingPacket } from '../../packets';
import { Room } from '../room';
import { Unit, UnitEffect, UnitType } from '../unit';
import { User } from '../user';
import { PetBreed } from './PetBreed';

export class Pet
{
    private _entity: PetEntity;

    private _unit: Unit;

    constructor(entity: PetEntity)
    {
        if(!(entity instanceof PetEntity)) throw new Error('invalid_entity');

        this._entity = entity;

        this._unit = new Unit(UnitType.PET, this);
    }

    public save(schedule: boolean = true): void
    {
        if(this._unit && this._unit.location.position)
        {
            const position = this._unit.location.position.copy();

            this._entity.x          = position.x || 0;
            this._entity.y          = position.y || 0;
            this._entity.z          = position.z.toString() || '0.00';
            this._entity.direction  = position.direction || 0;
        }

        if(schedule) Nitro.gameScheduler.savePet(this);
    }

    public async saveNow(): Promise<void>
    {
        Nitro.gameScheduler.removePet(this);

        this.save(false);

        await getManager().save(this._entity);
    }

    public ridePet(unit: Unit): void
    {
        if(!this._unit || !this._unit.room || !unit) return;

        let position = this._unit.location.position.getPositionLeft();

        if(!this._unit.room.map.getValidTile(unit, position))
        {
            position = this._unit.location.position.getPositionRight();

            if(!this._unit.room.map.getValidTile(unit, position)) return;

            // up or down position
        }

        if(!unit.location.position.compare(position))
        {
            unit.location.walkTo(position, false, false);

            unit.location.setGoalAction(() =>
            {
                if(unit.location.position.compare(position))
                {
                    unit.location.lookAtPosition(this._unit.location.position);
                    
                    unit.connectUnit(this._unit);

                    unit.location.position.x = this._unit.location.position.x + 0;
                    unit.location.position.y = this._unit.location.position.y + 0;

                    unit.location.position.setDirection(this._unit.location.position.direction);

                    unit.location.additionalHeight = 1;

                    unit.location.effect(UnitEffect.HORSE_SADDLE);

                    unit.updateNow();

                    this._unit.room.map.generateUnitCollison();
                }
            });
        }
    }

    public stopRiding(): void
    {
        if(!this._unit.room || !this._unit.connectedUnit) return;
        
        const connectedUnit = this._unit.room.unitManager.getUnit(this._unit.connectedUnit.id);

        if(!connectedUnit) return;

        let position = this._unit.location.position.getPositionLeft();

        if(!connectedUnit.room.map.getValidTile(connectedUnit, position))
        {
            position = this._unit.location.position.getPositionRight();

            if(!connectedUnit.room.map.getValidTile(connectedUnit, position)) return;
        }
        
        this._unit.connectUnit(null);

        connectedUnit.location.additionalHeight = 0;

        connectedUnit.updateNow();

        connectedUnit.location.effect(UnitEffect.NONE);

        connectedUnit.location.walkTo(position);
        
        connectedUnit.location.setGoalAction(() => connectedUnit.location.lookAtPosition(this._unit.location.position));
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

    public clearUser(): void
    {
        this._entity.userId = null;

        this.save();
    }

    public parseInventoryData(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        packet
            .writeInt(this._entity.id)
            .writeString(this._entity.name)
            .writeInt(this._entity.breed)
            .writeInt(this._entity.race)
            .writeString(this._entity.color)
            .writeInt(0, 0, 0);

        return packet;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get entity(): PetEntity
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

    public get level(): number
    {
        return this._entity.level;
    }

    public get breed(): PetBreed
    {
        return this._entity.breed;
    }

    public get race(): number
    {
        return this._entity.race;
    }

    public get color(): string
    {
        return this._entity.color;
    }

    public get hairStyle(): number
    {
        return this._entity.hairStyle;
    }

    public get hairColor(): number
    {
        return this._entity.hairColor;
    }

    public get unit(): Unit
    {
        return this._unit;
    }

    public set unit(unit: Unit)
    {
        this._unit = unit;
    }

    public get look(): string
    {
        let string = `${ this._entity.breed } ${ this._entity.race } ${ this._entity.color }`;

        let hasSadle = true;

        if(this._entity.breed === PetBreed.HORSE)
        {
            if(hasSadle) string += ` 3`;
            else string += ` 2`;

            string += ` 2 ${ this._entity.hairStyle } ${ this._entity.hairColor } 3 ${ this._entity.hairStyle } ${ this._entity.hairColor } 3 ${ this._entity.hairStyle } ${ this._entity.hairColor }`;

            if(hasSadle) string += ` 4 9 0`;
            else string += ``;
        }

        return string;
    }
}