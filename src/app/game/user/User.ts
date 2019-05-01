import { Subject, Subscription } from 'rxjs';
import { Logger } from '../../common';
import { UserEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { PermissionList, Rank } from '../security';
import { Unit, UnitType } from '../unit';
import { UserEvent } from './events';
import { UserInventory } from './inventory';
import { UserMessenger } from './messenger';
import { UserConnections } from './UserConnections';
import { UserDetails } from './UserDetails';

export class User
{
    private _id: number;
    private _logger: Logger;

    private _events: Subject<UserEvent>;
    private _subscription: Subscription;

    private _details: UserDetails;
    private _connections: UserConnections;
    private _inventory: UserInventory;
    private _messenger: UserMessenger;
    private _unit: Unit;
    private _rank: Rank;

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(entity: UserEntity)
    {
        if(!(entity instanceof UserEntity)) throw new Error('invalid_entity');

        this._id            = entity.id;
        this._logger        = new Logger('User', entity.username);

        this._events        = null;
        this._subscription  = null;

        this._details       = new UserDetails(entity, this);
        this._connections   = new UserConnections(this);
        this._inventory     = new UserInventory(this);
        this._messenger     = new UserMessenger(this);
        this._unit          = new Unit(UnitType.USER, this);
        this._rank          = null;
        
        this._isDisposed    = false;
        this._isDisposing   = false;

        this.loadRank();
    }

    public async init(): Promise<void>
    {
        if(this._isLoaded || this._isLoading || this._isDisposing) return;

        this._isLoading = true;

        this._events        = new Subject();
        this._subscription  = this._events.subscribe(async event => await this.handleEvent(event));

        if(this._inventory) await this._inventory.init();
        if(this._messenger) await this._messenger.init();

        this._isLoaded      = true;
        this._isLoading     = false;
        this._isDisposed    = false;
    }

    public async dispose(): Promise<void>
    {
        if(this._isDisposed || this._isDisposing || this._isLoading) return;

        this._isDisposing = true;

        this._rank = null;

        if(this._subscription) this._subscription.unsubscribe();

        if(this._details)
        {
            this._details.updateOnline(false);

            await this._details.saveNow(true);
        }

        if(this._inventory)     await this._inventory.dispose();
        if(this._messenger)     await this._messenger.dispose();
        if(this._unit)          await this._unit.dispose();
        if(this._connections)   await this._connections.dispose();

        this._isDisposed    = true;
        this._isDisposing   = false;
        this._isLoaded      = false;
    }

    private async handleEvent(event: UserEvent)
    {
        if(event instanceof UserEvent)
        {
            try
            {
                event.user = this;
                //this.setEventUser(event);

                await event.runEvent();
            }

            catch(err)
            {
                this.logger.error(err);
            }
        }
    }

    public loadRank(): void
    {
        this._rank = null;

        if(!this._details || !this._details.rankId) return;
        
        const rank = Emulator.gameManager.securityManager.rankManager.getRank(this._details.rankId);

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

    public get logger(): Logger
    {
        return this._logger;
    }

    public get events(): Subject<UserEvent>
    {
        return this._events;
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

    public get rank(): Rank
    {
        return this._rank;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public get isDisposing(): boolean
    {
        return this._isDisposing;
    }
}