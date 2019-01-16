import { getManager } from 'typeorm';

import { Emulator } from '../../Emulator';
import { UserEntity, TimeHelper, Logger } from '../../common';
import { Client } from '../../networking';

import { UserInfo } from './UserInfo';
import { UserStatistics } from './UserStatistics';
import { Messenger} from './messenger';

export class UserOffline
{
    private _entity: UserEntity;
    private _isLoaded: boolean;

    private _userInfo: UserInfo;
    private _userStatistics: UserStatistics;
    private _userMessenger: Messenger;

    constructor(private _userId: number)
    {
        this._entity            = null;
        this._isLoaded          = false;

        this._userInfo          = null;
        this._userStatistics    = null;
        this._userMessenger     = null;
    }

    public async loadUser(): Promise<boolean>
    {
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

        this._entity    = result;
        this._isLoaded  = true;

        return Promise.resolve(true);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get entity(): UserEntity
    {
        return this._entity;
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

    public get figure(): string
    {
        return this._entity.figure;
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