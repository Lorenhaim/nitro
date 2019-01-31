import { getManager } from 'typeorm';

import { UserInfoEntity, TimeHelper } from '../../../common';

export class Info
{
    private _isDisposed: boolean;
    private _isPending: boolean;

    constructor(private _entity: UserInfoEntity)
    {
        if(!(_entity instanceof UserInfoEntity)) throw new Error('invalid_user_info');

        this._isDisposed    = false;
        this._isPending     = false;
    }

    public async save(): Promise<void>
    {
        if(this._isPending)
        {
            await getManager().update(UserInfoEntity, this._entity.id, this._entity);
            
            this._isPending = false;
        }
    }

    public updateNavigator(navigatorX: number, navigatorY: number, navigatorWidth: number, navigatorHeight: number, navigatorSearchOpen: boolean): void
    {
        this._entity.navigatorX             = navigatorX;
        this._entity.navigatorY             = navigatorY;
        this._entity.navigatorWidth         = navigatorWidth;
        this._entity.navigatorHeight        = navigatorHeight;
        this._entity.navigatorSearchOpen    = navigatorSearchOpen ? '1' : '0';

        this._isPending = true;
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed)
        {
            await this.save();

            this._isDisposed    = true;
        }
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

    public get friendRequestsDisabled(): boolean
    {
        return this._entity.friendRequestsDisabled === '1';
    }

    public get navigatorX(): number
    {
        return this._entity.navigatorX;
    }

    public get navigatorY(): number
    {
        return this._entity.navigatorY;
    }

    public get navigatorWidth(): number
    {
        return this._entity.navigatorWidth;
    }

    public get navigatorHeight(): number
    {
        return this._entity.navigatorHeight;
    }

    public get navigatorSearchOpen(): boolean
    {
        return this._entity.navigatorSearchOpen === '1';
    }
}