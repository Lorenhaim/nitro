import { getManager } from 'typeorm';

import { Emulator } from '../../Emulator';
import { UserEntity, TimeHelper } from '../../common';
import { Client } from '../../networking';
import { UserFigureComposer } from '../../packets';

import { Info, Statistics } from './data';
import { Inventory } from './inventory';
import { Messenger } from './messenger';

export class User
{
    private _userId: number;
    private _client: Client;
    private _isAuthenticated: boolean;

    private _entity: UserEntity;
    private _info: Info;
    private _statistics: Statistics;
    private _inventory: Inventory;
    private _messenger: Messenger;

    private _isLoaded: boolean;
    private _isPending: boolean;
    private _isSaving: boolean;
    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(_userId: number, _client?: Client)
    {
        if(_userId && _client) throw new Error('invalid_construction');

        this._userId            = 0;
        this._client            = null;
        this._isAuthenticated   = false;

        this._entity        = null;
        this._info          = null;
        this._statistics    = null;
        this._inventory     = null;
        this._messenger     = null;

        this._isLoaded          = false;
        this._isPending         = false;
        this._isSaving          = false;
        this._isDisposed        = false;
        this._isDisposing       = false;

        if(_userId && !_client)
        {
            this._userId = _userId;
        }

        if(!_userId && _client)
        {
            if(!(_client instanceof Client)) throw new Error('invalid_client');

            this._client = _client;
        }
    }

    public async checkTicket(ticket: string): Promise<void>
    {
        if(this._userId || this._isAuthenticated || !this._client) return Promise.reject(new Error('invalid_authentication'));

        const userId = await Emulator.gameManager().securityManager().ticketManager().checkTicket(ticket);

        this._userId            = userId;
        this._isAuthenticated   = true;
    }

    public async loadUser(): Promise<boolean>
    {
        if(this._userId && !this._isLoaded)
        {
            const result = await getManager().findOne(UserEntity, this._userId, {
                relations: ['info', 'statistics']
            });

            if(!result) return Promise.reject(new Error('invalid_user'));

            if(!result.info) return Promise.reject(new Error('invalid_user_info'));

            if(!result.statistics) return Promise.reject(new Error('invalid_user_statistics'));

            this._info          = new Info(result.info);
            this._statistics    = new Statistics(result.statistics);

            delete result.info;
            delete result.statistics;

            this._entity = result;
            
            this._inventory = new Inventory(this);
            this._messenger = new Messenger(this);

            if(this._client) await this._messenger.init();

            this._isLoaded = true;
        }

        return Promise.resolve(true);
    }

    public async save(): Promise<void>
    {
        if(this._isPending && !this._isSaving)
        {
            this._isSaving = true;

            await getManager().update(UserEntity, this._userId, this._entity);

            this._isPending = false;
            this._isSaving  = false;
        }
    }

    public async setOnline(flag: boolean, immediate: boolean = true): Promise<void>
    {
        if(this._isAuthenticated && this._isLoaded)
        {
            if(flag)
            {
                this._entity.online     = '1';
                this._entity.lastOnline = TimeHelper.now;

                this._statistics.updateLoginStreak('login');
            }
            else
            {
                this._entity.online = '0';

                this._statistics.updateLoginStreak('logout');
            }
        }

        this._isPending = true;

        if(immediate) await this.save();

        if(this._messenger) await this._messenger.updateAllFriends();
    }

    public async updateFigure(gender: 'M' | 'F', figure: string): Promise<void>
    {
        this._entity.gender = gender === 'M' ? 'M' : 'F';
        this._entity.figure = figure;

        this._isPending = true;

        await this.save();

        if(this._isAuthenticated && this._client) await this._client.processComposer(new UserFigureComposer(this));

        if(this._messenger) await this._messenger.updateAllFriends();
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing = true;

            if(this._isLoaded)
            {
                if(this._isAuthenticated && this.online) await this.setOnline(false, false);

                if(this._info instanceof Info) await this._info.dispose();
                if(this._statistics instanceof Statistics) await this._statistics.dispose();

                await this.save();
            }

            this._isAuthenticated   = false;
            this._isDisposed        = true;
            this._isDisposing       = false;

            this._client.dispose();
        }
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get isAuthenticated(): boolean
    {
        return this._isAuthenticated;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get username(): string
    {
        return this._entity.username;
    }

    public get motto(): string
    {
        return this._entity.motto;
    }

    public get gender(): 'M' | 'F'
    {
        return this._entity.gender;
    }

    public set gender(gender: 'M' | 'F')
    {
        this._entity.gender = gender;

        this._isPending = true;
    }

    public get figure(): string
    {
        return this._entity.figure;
    }

    public set figure(figure: string)
    {
        this._entity.figure = figure;

        this._isPending = true;
    }

    public get rankId(): number
    {
        return this._entity.rankId || 0;
    }

    public get online(): boolean
    {
        return this._entity.online == '1';
    }

    public get lastOnline(): Date
    {
        return this._entity.lastOnline;
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }

    public client(): Client
    {
        return this._client;
    }

    public info(): Info
    {
        return this._info;
    }

    public statistics(): Statistics
    {
        return this._statistics;
    }

    public messenger(): Messenger
    {
        return this._messenger;
    }

    public inventory(): Inventory
    {
        return this._inventory;
    }
}