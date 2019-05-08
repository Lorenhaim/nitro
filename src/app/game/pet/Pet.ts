import { PetEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { OutgoingPacket } from '../../packets';
import { Room } from '../room';
import { Unit, UnitType } from '../unit';
import { User } from '../user';
import { PetBreed } from './PetBreed';

export class Pet
{
    private _entity: PetEntity;

    private _unit: Unit;

    private _rideCheckInterval: NodeJS.Timer;

    constructor(entity: PetEntity)
    {
        if(!(entity instanceof PetEntity)) throw new Error('invalid_entity');

        this._entity = entity;

        this._unit = new Unit(UnitType.PET, this);

        this._rideCheckInterval = null;
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

        Emulator.gameScheduler.savePet(this);
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

    public ridePet(unit: Unit)
    {
        if(!unit) return;

        const positions = this._unit.location.position.getPositionsAround();

        if(!positions) return;

        const totalPositions = positions.length;

        if(!totalPositions) return;

        for(let i = 0; i < totalPositions; i++)
        {
            const position = positions[i];

            if(!position) continue;

            if(!unit.location.position.compare(position)) continue;

            return unit.connectUnit(this._unit);
        }

        const positionInfront = this._unit.location.position.getPositionInfront();

        unit.location.walkTo(positionInfront);

        this._rideCheckInterval = setInterval(() => this.checkRide(unit), 250);
    }

    private checkRide(unit: Unit): void
    {
        if(!unit) return;

        const positionInfront = this._unit.location.position.getPositionInfront();

        if(unit.location.position.compare(positionInfront))
        {
            clearInterval(this._rideCheckInterval);

            unit.connectUnit(this._unit);

            return;
        }

        if(!unit.location.positionGoal || !unit.location.positionGoal.compare(positionInfront)) return clearInterval(this._rideCheckInterval);
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