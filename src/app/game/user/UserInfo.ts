import { getManager } from 'typeorm';

import { Logger, UserInfoEntity } from '../../common';

export class UserInfo
{
    private _isDisposed: boolean;
    private _isDisposing: boolean;
    private _isPending: boolean;
    private _isSaving: boolean;

    private _userId: number;

    constructor(private _entity: UserInfoEntity)
    {
        if(!(_entity instanceof UserInfoEntity)) throw new Error('invalid_user_info');

        this._isDisposed    = false;
        this._isDisposing   = false;
        this._isPending     = false;
        this._isSaving      = false;

        this._userId = _entity.userId;
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

    public async dispose(): Promise<boolean>
    {
        try
        {
            if(this._isDisposed) return true;

            if(!this._isDisposing)
            {
                this._isDisposing = true;

                await this.save();
            }

            this._isDisposed    = true;
            this._isDisposing   = false;

            return true;
        }

        catch(err)
        {
            Logger.writeError(`User Info Dispose Error [${ this.userId }] -> ${ err.message || err }`);
        }
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get homeRoom(): number
    {
        return this._entity.homeRoom;
    }

    public get clubExpiration(): Date
    {
        return this._entity.clubExpiration;
    }

    public get respectsReceived(): number
    {
        return this._entity.respectsReceived;
    }

    public get respectsRemaining(): number
    {
        return this._entity.respectsRemaining;
    }

    public get respectsPetRemaining(): number
    {
        return this._entity.respectsPetRemaining;
    }

    public get achievementScore(): number
    {
        return this._entity.achievementScore;
    }
}