import { Manager } from '../../../../common';
import { PetDao } from '../../../../database';
import { UserPetAddComposer, UserPetRemoveComposer } from '../../../../packets';
import { Pet } from '../../../pet';
import { User } from '../../User';

export class UserPets extends Manager
{
    private _user: User;
    private _pets: Pet[];

    constructor(user: User)
    {
        super('UserPets', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user  = user;
        this._pets  = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadPets();
    }

    protected async onDispose(): Promise<void>
    {
        this._pets = [];
    }

    public getPet(id: number): Pet
    {
        const totalPets = this._pets.length;

        if(!totalPets) return null;

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

    public addPet(...pets: Pet[]): void
    {
        const addedPets = [ ...pets ];

        if(!addedPets) return;
        
        const totalPets = addedPets.length;

        if(!totalPets) return;
        
        for(let i = 0; i < totalPets; i++)
        {
            const pet = addedPets[i];

            if(this.hasPet(pet.id)) continue;

            pet.clearRoom();

            this._pets.push(pet);

            this._user.connections.processOutgoing(new UserPetAddComposer(pet));
        }
    }

    public removePet(...pets: Pet[]): void
    {
        const removedPets = [ ...pets ];

        if(!removedPets) return;
        
        const totalPets = removedPets.length;
        const totalActivePets = this._pets.length;

        if(!totalPets || !totalActivePets) return;

        for(let i = 0; i < totalPets; i++)
        {
            const pet = removedPets[i];

            if(!pet) continue;

            for(let j = 0; j < totalActivePets; j++)
            {
                const activePet = this._pets[j];

                if(!activePet) continue;

                if(activePet !== pet) continue;

                this._user.connections.processOutgoing(new UserPetRemoveComposer(activePet.id));

                this._pets.splice(j, 1);

                break;
            }
        }
    }

    private async loadPets(): Promise<void>
    {
        this._pets = [];

        const results = await PetDao.loadUserPets(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;

        for(let i = 0; i < totalResults; i++) this._pets.push(new Pet(results[i]));
    }

    public get user(): User
    {
        return this._user;
    }

    public get pets(): Pet[]
    {
        return this._pets;
    }
}