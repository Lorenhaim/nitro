import { Subject, Subscription } from 'rxjs';
import { Logger } from '../../common';
import { RoomEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { OutgoingPacket } from '../../packets';
import { NavigatorCategory } from '../navigator';
import { RoomEvent } from './events';
import { RoomMap } from './mapping';
import { RoomModel } from './models';
import { RoomDetails } from './RoomDetails';
import { RoomItemManager } from './RoomItemManager';
import { RoomPetManager } from './RoomPetManager';
import { RoomSecurityManager } from './RoomSecurityManager';
import { RoomUnitManager } from './RoomUnitManager';
import { RoomWiredManager } from './RoomWiredManager';
import { RoomTaskManager } from './tasks';

export class Room
{
    private _id: number;
    private _logger: Logger;

    private _events: Subject<RoomEvent>;
    private _subscription: Subscription;

    private _details: RoomDetails;
    private _category: NavigatorCategory;
    private _model: RoomModel;
    private _map: RoomMap;

    private _unitManager: RoomUnitManager;
    private _taskManager: RoomTaskManager;
    private _itemManager: RoomItemManager;
    private _petManager: RoomPetManager;
    private _securityManager: RoomSecurityManager;
    private _wiredManager: RoomWiredManager;

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(entity: RoomEntity)
    {
        if(!(entity instanceof RoomEntity)) throw new Error('invalid_room');

        this._id                = entity.id;
        this._logger            = new Logger('Room', entity.id.toString());

        this._events            = new Subject();
        this._subscription      = null;

        this._details           = new RoomDetails(this, entity);

        this.loadCategory();
        this.loadModel();

        this._map               = null;

        this._unitManager       = new RoomUnitManager(this);
        this._taskManager       = new RoomTaskManager(this);
        this._itemManager       = new RoomItemManager(this);
        this._petManager        = new RoomPetManager(this);
        this._securityManager   = new RoomSecurityManager(this);
        this._wiredManager      = new RoomWiredManager(this);
        
        this._isLoaded          = false;
        this._isLoading         = false;
        
        this._isDisposed        = false;
        this._isDisposing       = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading && !this._isDisposing)
        {
            this._isLoading = true;

            if(!this._map)                      this._map = new RoomMap(this);
            if(!this._taskManager.isLoaded)     this._taskManager.init();
            if(!this._unitManager.isLoaded)     this._unitManager.init();
            if(!this._itemManager.isLoaded)     await this._itemManager.init();
            if(!this._petManager.isLoaded)      await this._petManager.init();
            if(!this._securityManager.isLoaded) await this._securityManager.init();
            if(!this._wiredManager.isLoaded)    await this._wiredManager.init();

            this._map.generateMap();

            this._subscription  = this._events.subscribe(async roomEvent => await this.handleEvent(roomEvent));

            this._isLoaded      = true;
            this._isLoading     = false;
            this._isDisposed    = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            this._isDisposing = true;

            if(this._subscription)      this._subscription.unsubscribe();
            
            if(this._wiredManager)      await this._wiredManager.dispose();
            if(this._securityManager)   await this._securityManager.dispose();
            if(this._unitManager)       await this._unitManager.dispose();
            if(this._taskManager)       this._taskManager.dispose();
            if(this._itemManager)       await this._itemManager.dispose();
            if(this._petManager)        await this._petManager.dispose();
            if(this._details)           await this._details.save();

            this._map = null;

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
        }
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

    public get id(): number
    {
        return this._id;
    }

    public get logger(): Logger
    {
        return this._logger;
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

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public get isDisposing(): boolean
    {
        return this._isDisposing;
    }
}