import { Manager } from '../../common';
import { UserEntity } from '../../database';
import { Nitro } from '../../Nitro';
import { PermissionList, Rank } from '../security';
import { Unit, UnitType } from '../unit';
import { UserInventory } from './inventory';
import { UserMessenger } from './messenger';
import { UserConnections } from './UserConnections';
import { UserDetails } from './UserDetails';

export class User extends Manager
{
    private _id: number;
    private _details: UserDetails;
    private _connections: UserConnections;
    private _inventory: UserInventory;
    private _messenger: UserMessenger;
    private _unit: Unit;
    private _rank: Rank;

    constructor(entity: UserEntity)
    {
        super('User');

        if(!(entity instanceof UserEntity)) throw new Error('invalid_entity');

        this.logger.contextInstance = entity.username;

        this._id            = entity.id;
        this._details       = new UserDetails(entity, this);
        this._connections   = new UserConnections(this);
        this._inventory     = new UserInventory(this);
        this._messenger     = new UserMessenger(this);
        this._unit          = new Unit(UnitType.USER, this);
        this._rank          = null;

        this.loadRank();
    }

    protected async onInit(): Promise<void>
    {
        await this._inventory.init();
        await this._messenger.init();

        this.logger.log(`Initialized`);
    }

    protected async onDispose(): Promise<void>
    {
        this._rank = null;
        
        this._details.updateOnline(false);

        await this._inventory.dispose();
        await this._messenger.dispose();
        await this._unit.dispose();
        await this._connections.dispose();

        await this._details.saveNow();
    }

    private loadRank(): void
    {
        this._rank = null;

        let rank: Rank = null;

        if(!this._details || !this._details.rankId)
        {
            rank = Nitro.gameManager.securityManager.rankManager.getRank(1);
        }

        if(!rank) rank = Nitro.gameManager.securityManager.rankManager.getRank(this._details.rankId);

        if(!rank) return;

        this._rank = rank;
    }

    public hasPermission(permission: PermissionList | string): boolean
    {
        return this._rank && this._rank.permission && this._rank.permission.hasPermission(permission);
    }

    public get id(): number
    {
        return this._id;
    }

    public get details(): UserDetails
    {
        return this._details;
    }

    public get connections(): UserConnections
    {
        return this._connections;
    }

    public get inventory(): UserInventory
    {
        return this._inventory;
    }

    public get messenger(): UserMessenger
    {
        return this._messenger;
    }

    public get unit(): Unit
    {
        return this._unit;
    }

    public set unit(unit: Unit)
    {
        this._unit = unit;
    }

    public get rank(): Rank
    {
        return this._rank;
    }
}