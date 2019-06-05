import { Manager } from '../../common';
import { RoomEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { OutgoingPacket } from '../../packets';
import { Group } from '../group';
import { NavigatorCategory } from '../navigator';
import { RoomMap } from './mapping';
import { RoomModel } from './models';
import { RoomBotManager } from './RoomBotManager';
import { RoomDetails } from './RoomDetails';
import { RoomItemManager } from './RoomItemManager';
import { RoomPetManager } from './RoomPetManager';
import { RoomSecurityManager } from './RoomSecurityManager';
import { RoomUnitManager } from './RoomUnitManager';
import { RoomWiredManager } from './RoomWiredManager';
import { RoomTaskManager } from './tasks';

export class Room extends Manager
{
    private _id: number;

    private _details: RoomDetails;
    private _group: Group;
    private _category: NavigatorCategory;
    private _model: RoomModel;
    private _map: RoomMap;

    private _unitManager: RoomUnitManager;
    private _taskManager: RoomTaskManager;
    private _itemManager: RoomItemManager;
    private _botManager: RoomBotManager;
    private _petManager: RoomPetManager;
    private _securityManager: RoomSecurityManager;
    private _wiredManager: RoomWiredManager;

    private _objectOwners: { id: number, username: string }[];
    private _didCancelDispose: boolean;

    constructor(entity: RoomEntity)
    {
        super(`Room ${ entity.id }`);

        if(!(entity instanceof RoomEntity)) throw new Error('invalid_room');

        this._id                = entity.id;
        this._details           = new RoomDetails(this, entity);
        this._group             = null;

        this._model             = null;
        this._map               = null;
        
        this.loadCategory();

        this._unitManager       = new RoomUnitManager(this);
        this._taskManager       = new RoomTaskManager(this);
        this._itemManager       = new RoomItemManager(this);
        this._botManager        = new RoomBotManager(this);
        this._petManager        = new RoomPetManager(this);
        this._securityManager   = new RoomSecurityManager(this);
        this._wiredManager      = new RoomWiredManager(this);

        this._objectOwners      = [];
        this._didCancelDispose  = false;
    }

    protected async onInit(): Promise<void>
    {
        await this.loadMapping();

        if(!this._model || !this._map) throw new Error('invalid_mapping');

        const group = await Emulator.gameManager.groupManager.getGroup(this._details.groupId);

        if(group) this._group = group;

        this._taskManager.init();

        await this._itemManager.init();
        await this._botManager.init();
        await this._petManager.init();
        await this._securityManager.init();

        this._map.generateMap();

        this.cancelDispose();
    }

    protected async onDispose(): Promise<void>
    {
        this._taskManager.dispose();

        await this._botManager.dispose();
        await this._petManager.dispose();
        await this._securityManager.dispose();

        this._unitManager.dispose();

        this._details.setUsersNow(0);

        await this._details.saveNow();

        this._map = null;
    }

    public tryDispose(): void
    {
        if(this._isDisposed || this._isDisposing || this._isLoading) return;

        if(this._details.usersNow) return;

        this._didCancelDispose = false;

        setTimeout(async () =>
        {
            if(this._didCancelDispose) return;

            await Emulator.gameManager.roomManager.removeRoom(this);
        }, 60000);
    }

    public cancelDispose(): void
    {
        this._didCancelDispose = true;
    }

    private loadCategory(): void
    {
        this._category = null;

        if(!this._details || !this._details.categoryId) return;
        
        const category = Emulator.gameManager.navigatorManager.getCategory(this._details.categoryId);

        if(!category) return;
        
        this._category = category;
    }

    public async loadMapping(): Promise<void>
    {
        this._model = null;
        this._map   = null;

        if(!this._details || !this._details.modelId) return;

        let model = Emulator.gameManager.roomManager.getModel(this._details.modelId);

        if(!model)
        {
            await Emulator.gameManager.roomManager.loadCustomModel(this._details.modelId);

            model = Emulator.gameManager.roomManager.getModel(this._details.modelId);
        }

        if(!model || !model.didGenerate) return;

        this._model = model;
        this._map   = new RoomMap(this);
    }

    public parseInfo(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;
        
        packet.writeInt(this._details.id).writeString(this._details.name);

        if(this._category && this._category.isPublic) packet.writeInt(0).writeString(null);
        else packet.writeInt(this._details.ownerId).writeString(this._details.ownerName);

        packet
            .writeInt(this._details.state)
            .writeInt(this._details.usersNow)
            .writeInt(this._details.usersMax)
            .writeString(this._details.description)
            .writeInt(this._details.tradeType)
            .writeInt(2)
            .writeInt(this._details.totalLikes)
            .writeInt(this._details.categoryId)
            .writeInt(0); //tags foreach, string

        let start = 0;

        if(this._group) start += 2;

        if(!this._category || !this._category.isPublic) start += 8;

        if(this._details.allowPets) start += 16;
        
        // promoted + 4

        packet.writeInt(start);

        if(this._group) this._group.parseSimpleInfo(packet);

        return packet;
    }

    public parseChatSettings(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;
        
        return packet.writeInt(this._details.chatMode, this._details.chatWeight, this._details.chatSpeed, this._details.chatDistance, this._details.chatProtection);
    }

    public getObjectOwnerName(userId: number): string
    {
        const totalOwners = this._objectOwners.length;

        if(!totalOwners) return null;

        for(let i = 0; i < totalOwners; i++)
        {
            const owner = this._objectOwners[i];

            if(!owner) continue;

            if(owner.id !== userId) continue;

            return owner.username;
        }

        return null;
    }

    public addObjectOwnerName(userId: number, username: string)
    {
        if(!this.getObjectOwnerName(userId)) this._objectOwners.push({ id: userId, username });
    }

    public get id(): number
    {
        return this._id;
    }

    public get details(): RoomDetails
    {
        return this._details;
    }

    public get group(): Group
    {
        return this._group;
    }

    public get category(): NavigatorCategory
    {
        return this._category;
    }

    public get model(): RoomModel
    {
        return this._model;
    }

    public get map(): RoomMap
    {
        return this._map;
    }

    public get unitManager(): RoomUnitManager
    {
        return this._unitManager;
    }

    public get taskManager(): RoomTaskManager
    {
        return this._taskManager;
    }

    public get itemManager(): RoomItemManager
    {
        return this._itemManager;
    }

    public get botManager(): RoomBotManager
    {
        return this._botManager;
    }

    public get petManager(): RoomPetManager
    {
        return this._petManager;
    }

    public get securityManager(): RoomSecurityManager
    {
        return this._securityManager;
    }

    public get wiredManager(): RoomWiredManager
    {
        return this._wiredManager;
    }

    public get objectOwners(): { id: number, username: string }[]
    {
        return this._objectOwners;
    }

    public get didCancelDispose(): boolean
    {
        return this._didCancelDispose;
    }
}