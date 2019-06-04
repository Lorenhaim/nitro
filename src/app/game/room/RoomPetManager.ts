import { Manager } from '../../common';
import { PetDao } from '../../database';
import { Emulator } from '../../Emulator';
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

            this._room.unitManager.removeUnit(pet.unit);

            await pet.saveNow();

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

    public placePet(user: User, petId: number, position: Position): Pet
    {
        if(!user || !petId || !position) return;

        const pet = user.inventory.pets.getPet(petId);

        if(!pet) return;

        if(this.hasPet(pet.id)) return;

        const tile = this._room.map.getTile(position);

        //if(!tile) return;

        position.z = tile.walkingHeight;

        pet.setRoom(this._room);

        user.inventory.pets.removePet(pet);

        this._room.addObjectOwnerName(pet.userId, user.details.username);

        this._room.unitManager.addUnit(pet.unit, position);

        this._pets.push(pet);

        this._room.unitManager.updateUnits(pet.unit);

        pet.save();

        return pet;
    }

    public pickupAllPets(user: User): void
    {
        if(!user) return;

        const totalPets = this._pets.length;

        if(!totalPets) return;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = this._pets[i];

            if(!pet) continue;

            this.pickupPet(user, pet.id);
        }
    }

    public pickupPet(user: User, petId: number): Promise<void>
    {
        if(!user || !petId) return;

        if(!this._room.securityManager.hasRights(user)) return;

        const totalPets = this._pets.length;

        if(!totalPets) return;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = this._pets[i];

            if(!pet) continue;

            if(pet.id !== petId) continue;

            pet.unit.reset(false);

            this._pets.splice(i, 1);

            pet.clearRoom();

            if(pet.userId === user.id)
            {
                user.inventory.pets.addPet(pet);
            }
            else
            {
                const activeUser = Emulator.gameManager.userManager.getUserById(pet.userId);

                if(activeUser) activeUser.inventory.pets.addPet(pet);
            }

            pet.save();

            return;
        }
    }

    private async loadPets(): Promise<void>
    {
        if(this._isLoaded) return;
        
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

            this._room.unitManager.addUnit(pet.unit, pet.unit.location.position);
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