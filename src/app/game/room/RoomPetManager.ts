import { Manager } from '../../common';
import { PetDao } from '../../database';
import { Position } from '../pathfinder';
import { Pet } from '../pet';
import { User } from '../user';
import { Room } from './Room';

export class RoomPetManager extends Manager
{
    private _room: Room;

    private _pets: Pet[];

    constructor(room: Room)
    {
        super('RoomPetManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room  = room;

        this._pets  = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadPets();
    }

    protected async onDispose(): Promise<void>
    {
        const totalPets = this._pets.length;

        if(!totalPets) return;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = this._pets[i];

            if(!pet) continue;

            await this._room.unitManager.removeUnit(pet.unit);

            this._pets.splice(i, 1);
        }
    }

    public getPet(id: number): Pet
    {
        if(!id) return null;
        
        const totalPets = this._pets.length;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = this._pets[i];

            if(pet.id === id) return pet;
        }

        return null;
    }

    public hasPet(id: number): boolean
    {
        return this.getPet(id) !== null;
    }

    public getPetByName(name: string): Pet
    {
        if(!name) return null;
        
        const totalPets = this._pets.length;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = this._pets[i];

            if(pet.name === name) return pet;
        }

        return null;
    }

    public async placePet(user: User, petId: number, position: Position): Promise<void>
    {
        if(!user || !petId) return;

        const pet = user.inventory.pets.getPet(petId);

        if(!pet) return;

        if(this.hasPet(pet.id)) return;

        pet.setRoom(this._room);

        this._pets.push(pet);

        user.inventory.pets.removePet(pet);

        if(!this._room.getObjectOwnerName(pet.userId) && user.details.username) this._room.objectOwners.push({ id: pet.userId, username: user.details.username });

        await this._room.unitManager.addUnit(pet.unit, null);

        pet.save();
    }

    public async pickupPet(user: User, petId: number): Promise<void>
    {
        if(!user || !petId) return;

        const totalPets = this._pets.length;

        if(!totalPets) return;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = this._pets[i];

            if(!pet) continue;

            if(pet.id !== petId) continue;

            await pet.unit.reset(false);

            this._pets.splice(i, 1);

            pet.clearRoom();

            user.inventory.pets.addPet(pet);

            pet.save();

            return;
        }
    }

    private async loadPets(): Promise<void>
    {
        this._pets = [];

        const results = await PetDao.loadRoomPets(this._room.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            const pet = new Pet(result);

            if(!this._room.getObjectOwnerName(result.userId))
            {
                const username = await PetDao.getOwnerUsername(result.id);

                this._room.objectOwners.push({ id: pet.userId, username });
            }

            pet.unit.room               = this._room;
            pet.unit.location.position  = new Position(result.x, result.y, parseFloat(result.z), result.direction, result.direction);

            this._pets.push(pet);

            await this._room.unitManager.addUnit(pet.unit, pet.unit.location.position);
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get pets(): Pet[]
    {
        return this._pets;
    }
}