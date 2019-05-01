import { Manager } from '../../common';
import { AuthenticationManager } from './AuthenticationManager';
import { PermissionManager } from './permission';
import { RankManager } from './rank';
import { TicketManager } from './TicketManager';

export class SecurityManager extends Manager
{
    private _authenticationManager: AuthenticationManager;
    private _permissionManager: PermissionManager;
    private _rankManager: RankManager;
    private _ticketManager: TicketManager;

    constructor()
    {
        super('SecurityManager');

        this._authenticationManager = new AuthenticationManager();
        this._permissionManager     = new PermissionManager();
        this._rankManager           = new RankManager();
        this._ticketManager         = new TicketManager();

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    protected async onInit(): Promise<void>
    {
        await this._permissionManager.init();
        await this._rankManager.init();
    }

    protected async onDispose(): Promise<void>
    {
        if(this._permissionManager !== null)    await this._permissionManager.dispose();
        if(this._rankManager !== null)          await this._rankManager.dispose();
    }
    
    public get authenticationManager(): AuthenticationManager
    {
        return this._authenticationManager;
    }

    public get permissionManager(): PermissionManager
    {
        return this._permissionManager;
    }

    public get rankManager(): RankManager
    {
        return this._rankManager;
    }

    public get ticketManager(): TicketManager
    {
        return this._ticketManager;
    }
}