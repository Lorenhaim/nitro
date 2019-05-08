import { Subject, Subscription } from 'rxjs';
import { Manager } from '../../common';
import { RoomEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { OutgoingPacket } from '../../packets';
import { NavigatorCategory } from '../navigator';
import { RoomEvent } from './events';
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

    private _events: Subject<RoomEvent>;
    private _subscription: Subscription;

    private _details: RoomDetails;
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

    constructor(entity: RoomEntity)
    {
        super(`Room ${ entity.id }`);

        if(!(entity instanceof RoomEntity)) throw new Error('invalid_room');

        this._id                = entity.id;

        this._events            = new Subject();
        this._subscription      = null;

        this._details           = new RoomDetails(this, entity);

        this.loadCategory();
        this.loadModel();

        this._map               = null;

        this._unitManager       = new RoomUnitManager(this);
        this._taskManager       = new RoomTaskManager(this);
        this._itemManager       = new RoomItemManager(this);
        this._botManager        = new RoomBotManager(this);
        this._petManager        = new RoomPetManager(this);
        this._securityManager   = new RoomSecurityManager(this);
        this._wiredManager      = new RoomWiredManager(this);

        this._objectOwners      = [];
    }

    protected async onInit(): Promise<void>
    {
        this._map = new RoomMap(this);

        this._taskManager.init();
        this._unitManager.init();

        await this._itemManager.init();
        await this._botManager.init();
        await this._petManager.init();
        await this._securityManager.init();
        await this._wiredManager.init();

        this._subscription  = this._events.subscribe(async roomEvent => await this.handleEvent(roomEvent));

        this._map.generateMap();
    }

    protected async onDispose(): Promise<void>
    {
        if(this._subscription) this._subscription.unsubscribe();

        await this._wiredManager.dispose();
        await this._securityManager.dispose();
        await this._unitManager.dispose();
        this._taskManager.dispose();
        await this._itemManager.dispose();
        await this._botManager.dispose();
        await this._petManager.dispose();
        await this._details.save();

        this._map = null;
    }

    public tryDispose(): void
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            if(this._unitManager.units.length > 0) return;
            
            Emulator.gameManager.roomManager.removeRoom(this);
        }
    }

    private async handleEvent(event: RoomEvent)
    {
        if(event instanceof RoomEvent)
        {
            try
            {
                event.setRoom(this);
                
                await event.runEvent();
            }

            catch(err)
            {
                this.logger.error(err);
            }
        }
    }

    private loadCategory(): void
    {
        if(this._details && this._details.categoryId)
        {
            const category = Emulator.gameManager.navigatorManager.getCategory(this._details.categoryId);

            if(category)
            {
                this._category = category;

                return;
            }
        }

        this._category = null;
    }

    private loadModel(): void
    {
        if(this._details && this._details.modelId)
        {
            const model = Emulator.gameManager.roomManager.getModel(this._details.modelId);

            if(model)
            {
                this._model = model;

                return;
            }
            else
            {
                throw new Error('invalid_model');
            }
        }
        else
        {
            throw new Error('invalid_model');
        }
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
            .writeInt(0) // score
            .writeInt(this._details.categoryId)
            .writeInt(0); //tags foreach, string

        let start = 0;

        if(!this._category || !this._category.isPublic) start += 8;

        if(this._details.allowPets) start += 16;
        
        // group + 2, promoted + 4

        packet.writeInt(start);

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

    public get id(): number
    {
        return this._id;
    }

    public get events(): Subject<RoomEvent>
    {
        return this._events;
    }

    public get details(): RoomDetails
    {
        return this._details;
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
}