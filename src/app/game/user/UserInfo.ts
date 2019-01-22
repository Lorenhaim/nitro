import { getManager } from 'typeorm';

import { UserInfoEntity, TimeHelper } from '../../common';

export class UserInfo
{
    private _isDisposed: boolean;
    private _isDisposing: boolean;

    private _isPending: boolean;
    private _isSaving: boolean;

    constructor(private _entity: UserInfoEntity)
    {
        if(!(_entity instanceof UserInfoEntity)) throw new Error('invalid_user_info');

        this._isDisposed    = false;
        this._isDisposing   = false;

        this._isPending     = false;
        this._isSaving      = false;
    }

    public async save(): Promise<boolean>
    {
        if(!this._isPending) return Promise.resolve(true);

        if(!this._isSaving)
        {
            this._isSaving = true;

            await getManager().update(UserInfoEntity, this._entity.id, this._entity);
        }

        this._isPending = false;
        this._isSaving  = false;

        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        if(this._isDisposed) return Promise.resolve(true);

        if(!this._isDisposing)
        {
            this._isDisposing = true;

            await this.save();
        }

        this._isDisposed    = true;
        this._isDisposing   = false;

        return Promise.resolve(true);
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get homeRoom(): number
    {
        return this._entity.homeRoom || 0;
    }

    public get clubActive(): boolean
    {
        return TimeHelper.between(this._entity.clubExpiration, TimeHelper.now, 'seconds') > 0;
    }

    public get clubExpiration(): Date
    {
        return this._entity.clubExpiration;
    }

    public get respectsReceived(): number
    {
        return this._entity.respectsReceived || 0;
    }

    public get respectsRemaining(): number
    {
        return this._entity.respectsRemaining || 0;
    }

    public get respectsPetRemaining(): number
    {
        return this._entity.respectsPetRemaining || 0;
    }

    public get achievementScore(): number
    {
        return this._entity.achievementScore || 0;
    }

    public get messengerDisabled(): boolean
    {
        return this._entity.messengerDisabled === '1';
    }

    public get friendRequestsDisabled(): boolean
    {
        return this._entity.friendRequestsDisabled === '1';
    }
}