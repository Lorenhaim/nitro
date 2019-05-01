import { PetDao } from '../../database';
import { Position } from '../pathfinder';
import { Pet } from '../pet';
import { User } from '../user';
import { Room } from './Room';

export class RoomPetManager
{
    private _room: Room;

    private _pets: Pet[];

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room          = room;

        this._pets         = [];

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading && !this._isDisposing)
        {
            this._isLoading = true;

            await this.loadPets();

            this._isLoaded      = true;
            this._isLoading     = false;
            this._isDisposed    = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            this._isDisposing = true;

            this._pets          = [];

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
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

        await this._room.unitManager.addUnit(pet.unit, null, null, true);

        pet.unit.location.walkToUnit(user.unit);

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

            await this._room.unitManager.removeUnit(pet.unit, true, false);

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

        if(results)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

                    const pet = new Pet(result);

                    pet.unit.room               = this._room;
                    pet.unit.location.position  = new Position(result.x, result.y, parseFloat(result.z), result.direction, result.direction);

                    this._pets.push(pet);

                    this._room.unitManager.units.push(pet.unit);
                }
            }
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

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}