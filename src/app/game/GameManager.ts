import { getManager } from 'typeorm';

import { Logger } from '../common';

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
        this._isReady = false;

        this._navigatorManager  = new NavigatorManager();
        this._securityManager   = new SecurityManager();
        this._userManager       = new UserManager();
    }

    public async init(): Promise<boolean>
    {
        try
        {
            await this._navigatorManager.init();
            await this._securityManager.init();
            await this._userManager.init();

            Logger.writeLine(`GameManager -> Loaded`);

            this._isReady = true;

            return true;
        }

        catch(err)
        {
            Logger.writeError(`GameManager Init Error -> ${ err.message || err }`);

            await this.dispose();
        }
    }

    public async cleanup(): Promise<boolean>
    {
        await getManager().query(`UPDATE user SET online = '0'`);

        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        try
        {
            await this._securityManager.dispose();
            await this._userManager.dispose();

            Logger.writeLine(`GameManager -> Disposed`);

            return true;
        }

        catch(err)
        {
            Logger.writeError(`GameManager Dispose Error -> ${ err.message || err }`);
        }
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