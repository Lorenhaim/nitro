import { getManager } from 'typeorm';

import { Logger, UserEntity } from '../common';

import { NavigatorManager } from './navigator';
import { SecurityManager } from './security';
import { UserManager } from './user';

export class GameManager
{
    private _isReady: boolean;

    private _navigatorManager: NavigatorManager;
    private _securityManager: SecurityManager;
    private _userManager: UserManager;

    constructor()
    {
        this._navigatorManager  = new NavigatorManager();
        this._securityManager   = new SecurityManager();
        this._userManager       = new UserManager();
    }

    public async init(): Promise<void>
    {
        await this._navigatorManager.init();
        await this._securityManager.init();
        await this._userManager.init();

        this._isReady = true;
    }

    public async cleanup(): Promise<void>
    {
        await getManager().query(`UPDATE users SET online = '0'`);
    }

    public async dispose(): Promise<void>
    {
        await this._securityManager.dispose();
        await this._userManager.dispose();
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }

    public navigatorManager(): NavigatorManager
    {
        return this._navigatorManager;
    }
    
    public securityManager(): SecurityManager
    {
        return this._securityManager;
    }

    public userManager(): UserManager
    {
        return this._userManager;
    }
}