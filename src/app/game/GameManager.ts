import { getManager } from 'typeorm';
import { Manager } from '../common/interfaces/Manager';
import { CatalogManager } from './catalog';
import { CommandManager } from './command';
import { ItemManager } from './item';
import { NavigatorManager } from './navigator';
import { PetManager } from './pet';
import { RoomManager } from './room';
import { SecurityManager } from './security';
import { UserManager } from './user';

export class GameManager extends Manager
{
    private _securityManager: SecurityManager;
    private _userManager: UserManager;
    private _navigatorManager: NavigatorManager;
    private _roomManager: RoomManager;
    private _itemManager: ItemManager;
    private _catalogManager: CatalogManager;
    private _commandManager: CommandManager;
    private _petManager: PetManager;

    constructor()
    {
        super('GameManager');

        this._securityManager   = new SecurityManager();
        this._userManager       = new UserManager();
        this._navigatorManager  = new NavigatorManager();
        this._roomManager       = new RoomManager();
        this._itemManager       = new ItemManager();
        this._catalogManager    = new CatalogManager();
        this._commandManager    = new CommandManager();
        this._petManager        = new PetManager();

    }

    public async onInit(): Promise<void>
    {
        await this._securityManager.init();
        await this._userManager.init();
        await this._navigatorManager.init();
        await this._roomManager.init();
        await this._itemManager.init();
        await this._catalogManager.init();
        await this._commandManager.init();
        await this._petManager.init();
    }

    public async onDispose(): Promise<void>
    {
        await this._petManager.dispose();
        await this._catalogManager.dispose();
        await this._commandManager.dispose();
        await this._itemManager.dispose();
        await this._navigatorManager.dispose();
        await this._roomManager.dispose();
        await this._securityManager.dispose();
        await this._userManager.dispose();
    }

    public async cleanup(): Promise<void>
    {
        await getManager().query(`UPDATE users SET online = '0'`);
        await getManager().query(`UPDATE rooms SET users_now = '0'`);
    }

    public get catalogManager(): CatalogManager
    {
        return this._catalogManager;
    }

    public get commandManager(): CommandManager
    {
        return this._commandManager;
    }

    public get itemManager(): ItemManager
    {
        return this._itemManager;
    }

    public get navigatorManager(): NavigatorManager
    {
        return this._navigatorManager;
    }

    public get roomManager(): RoomManager
    {
        return this._roomManager;
    }
    
    public get securityManager(): SecurityManager
    {
        return this._securityManager;
    }

    public get userManager(): UserManager
    {
        return this._userManager;
    }

    public get petManager(): PetManager
    {
        return this._petManager;
    }
}