import { getManager } from 'typeorm';

import { Emulator } from '../../Emulator';
import { UserEntity, TimeHelper, Logger } from '../../common';
import { Client } from '../../networking';

import { UserInfo } from './UserInfo';
import { UserStatistics } from './UserStatistics';
import { Messenger} from './messenger';

export class User
{
    private _isDisposed: boolean;
    private _isDisposing: boolean;
    private _isPending: boolean;
    private _isSaving: boolean;

    private _client: Client;
    private _userId: number;
    private _isAuthenticated: boolean;
    private _entity: UserEntity;

    private _userInfo: UserInfo;
    private _userStatistics: UserStatistics;
    private _userMessenger: Messenger;

    private _onlineStart: Date;

    constructor(_client: Client, _userId?: number)
    {
        if(_client instanceof Client) this._client = _client;
        else this._client = null;
        
        if(!_client && _userId) this._userId = _userId;
        else this._userId = 0;

        this._isDisposed    = false;
        this._isDisposing   = false;

        this._isAuthenticated   = false;
        this._entity            = null;

        this._userInfo          = null;
        this._userStatistics    = null;
        this._userMessenger     = null;
    }

    public async checkTicket(ticket: string): Promise<boolean>
    {
        if(!this._client) return Promise.reject(new Error('authentication_disabled'));

        if(this._userId || this._isAuthenticated) return Promise.reject(new Error('already_authenticated'));

        const userId = await Emulator.gameManager().securityManager().ticketManager().checkTicket(ticket);

        if(!userId) return Promise.reject(new Error('invalid_ticket'));

        this._userId = userId;

        return Promise.resolve(true);
    }

    public async loadUser(): Promise<boolean>
    {
        if(this._client && !this._userId || this._isAuthenticated) return Promise.reject(new Error('invalid_authentication'));

        const result = await getManager().findOne(UserEntity, this._userId, {
            relations: ['info', 'statistics']
        });

        if(!result) return Promise.reject(new Error('invalid_user'));

        if(!result.info) return Promise.reject(new Error('invalid_user_info'));

        if(!result.statistics) return Promise.reject(new Error('invalid_user_statistics'));

        this._userInfo          = new UserInfo(result.info);
        this._userStatistics    = new UserStatistics(result.statistics);
        this._userMessenger     = new Messenger(this._userId);

        delete result.info;
        delete result.statistics;

        await this._userMessenger.init();

        this._entity = result;

        if(this._client) this._isAuthenticated = true;

        return Promise.resolve(true);
    }

    public async save(): Promise<boolean>
    {
        if(!this._isPending) return Promise.resolve(true);

        if(!this._isSaving)
        {
            this._isSaving = true;

            await getManager().save(this._entity);
        }

        this._isPending = false;
        this._isSaving  = false;

        return Promise.resolve(true);
    }

    public async setOnline(flag: boolean, immediate: boolean = true): Promise<boolean>
    {
        if(!this._client) return Promise.reject(new Error('invalid_client'));
        
        if(flag)
        {
            this._entity.online     = '1';
            this._entity.lastOnline = TimeHelper.now;

            this._userStatistics.updateLoginStreak('login');

            if(this.userMessenger())
            {
                await this.userMessenger().updateAllFriends(this._entity);
            }
        }
        else
        {
            this._entity.online = '0';

            this._userStatistics.updateLoginStreak('logout');

            if(this.userMessenger())
            {
                await this.userMessenger().updateAllFriends(this._entity);
            }
        }

        this._isPending = true;

        if(immediate) await this.save();

        return Promise.resolve(true);
    }

    public async updateFigure(gender: 'M' | 'F', figure: string): Promise<boolean>
    {
        this._entity.gender = gender;
        this._entity.figure = figure;

        this._isPending = true;

        await this.save();

        if(this.userMessenger())
        {
            await this.userMessenger().updateAllFriends(this._entity);
        }

        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        if(this._isDisposed) return Promise.resolve(true);

        if(!this._isDisposing)
        {
            this._isDisposing = true;

            if(this._isAuthenticated)
            {
                await this.setOnline(false, false);

                if(this._userInfo instanceof UserInfo) await this._userInfo.dispose();
                if(this._userStatistics instanceof UserStatistics) await this._userStatistics.dispose();

                await this.save();
            }
        }

        this._isDisposed        = true;
        this._isDisposing       = false;
        this._isAuthenticated   = false;

        this._client.dispose();

        return Promise.resolve(true);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get isAuthenticated(): boolean
    {
        return this._isAuthenticated;
    }

    public get entity(): UserEntity
    {
        return this._entity;
    }

    public client(): Client
    {
        return this._client;
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

    public userInfo(): UserInfo
    {
        return this._userInfo;
    }

    public userStatistics(): UserStatistics
    {
        return this._userStatistics;
    }

    public userMessenger(): Messenger
    {
        return this._userMessenger;
    }
}