import { getManager } from 'typeorm';

import { Emulator } from '../../Emulator';
import { UserEntity, TimeHelper } from '../../common';
import { Client } from '../../networking';

import { UserInfo } from './UserInfo';
import { UserMessenger } from './UserMessenger';
import { UserStatistics } from './UserStatistics';

export class User
{
    private _userId: number;
    private _client: Client;
    private _isAuthenticated: boolean;

    private _entity: UserEntity;
    private _userInfo: UserInfo;
    private _userMessenger: UserMessenger;
    private _userStatistics: UserStatistics;

    private _isDisposed: boolean;
    private _isDisposing: boolean;
    private _isPending: boolean;
    private _isSaving: boolean;

    constructor(_userId: number, _client?: Client)
    {
        if(_userId && _client) throw new Error('invalid_construction');

        this._userId            = 0;
        this._client            = null;
        this._isAuthenticated   = false;

        this._entity            = null;
        this._userInfo          = null;
        this._userMessenger     = null;
        this._userStatistics    = null;

        this._isDisposed        = false;
        this._isDisposing       = false;
        this._isPending         = false;
        this._isSaving          = false;

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

    public async checkTicket(ticket: string): Promise<boolean>
    {
        if(this._isAuthenticated) return Promise.reject(new Error('authentication_disabled'));

        const userId = await Emulator.gameManager().securityManager().ticketManager().checkTicket(ticket);

        if(!userId) return Promise.reject(new Error('invalid_ticket'));

        this._userId = userId;

        return Promise.resolve(true);
    }

    public async loadUser(): Promise<boolean>
    {
        if(!this._userId || this._isAuthenticated) return Promise.reject(new Error('invalid_user'));

        const result = await getManager().findOne(UserEntity, this._userId, {
            relations: ['info', 'statistics']
        });

        if(!result) return Promise.reject(new Error('invalid_user5'));

        if(!result.info) return Promise.reject(new Error('invalid_user_info'));

        if(!result.statistics) return Promise.reject(new Error('invalid_user_statistics'));

        this._userInfo          = new UserInfo(result.info);
        this._userStatistics    = new UserStatistics(result.statistics);

        delete result.info;
        delete result.statistics;

        this._entity = result;

        this._isAuthenticated = true;

        if(!this._userInfo.messengerDisabled)
        {
            this._userMessenger = new UserMessenger(this);

            await this._userMessenger.init();
        }

        return Promise.resolve(true);
    }

    public async save(): Promise<boolean>
    {
        if(!this._isPending) return Promise.resolve(true);

        await getManager().update(UserEntity, this._userId, this._entity);

        this._isPending = false;

        return Promise.resolve(true);
    }

    public async setOnline(flag: boolean, immediate: boolean = true): Promise<boolean>
    {
        if(!this._isAuthenticated) return Promise.reject(new Error('invalid_user'));
        
        if(flag)
        {
            this._entity.online     = '1';
            this._entity.lastOnline = TimeHelper.now;

            this._userStatistics.updateLoginStreak('login');

            if(this._userMessenger) await this._userMessenger.updateAllFriends({
                userId: this._entity.id,
                username: this._entity.username,
                motto: this._entity.motto,
                gender: this._entity.gender,
                figure: this._entity.figure,
                online: true
            });
        }
        else
        {
            this._entity.online = '0';

            this._userStatistics.updateLoginStreak('logout');

            if(this._userMessenger) await this._userMessenger.updateAllFriends({
                userId: this._entity.id,
                username: this._entity.username,
                motto: this._entity.motto,
                gender: this._entity.gender,
                figure: this._entity.figure,
                online: false
            });
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
            await this.userMessenger().updateAllFriends({
                userId: this.userId,
                username: this.username,
                motto: this.motto,
                gender: this.gender,
                figure: this.figure,
                online: this.online
            });
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

    public userInfo(): UserInfo
    {
        return this._userInfo;
    }

    public userStatistics(): UserStatistics
    {
        return this._userStatistics;
    }

    public userMessenger(): UserMessenger
    {
        return this._userMessenger;
    }
}