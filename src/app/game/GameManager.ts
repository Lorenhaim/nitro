import { Logger } from '../common';

import { SecurityManager } from './security';
import { UserManager } from './user';

export class GameManager
{
    private _securityManager: SecurityManager;
    private _userManager: UserManager;

    constructor()
    {
        this._securityManager   = new SecurityManager();
        this._userManager       = new UserManager();
    }

    public async init(): Promise<boolean>
    {
        try
        {
            await this._securityManager.init();
            await this._userManager.init();

            Logger.writeLine(`GameManager -> Loaded`);

            return true;
        }

        catch(err)
        {
            Logger.writeError(`GameManager Init Error -> ${ err.message || err }`);
        }
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
    
    public securityManager(): SecurityManager
    {
        return this._securityManager;
    }

    public userManager(): UserManager
    {
        return this._userManager;
    }
}