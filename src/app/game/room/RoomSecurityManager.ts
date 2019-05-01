import { Manager } from '../../common';
import { RoomRightsDao } from '../../database';
import { Emulator } from '../../Emulator';
import { RoomRightsListAddComposer, RoomRightsListRemoveComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Room } from './Room';

export class RoomSecurityManager extends Manager
{
    private _room: Room;

    private _rights: { id: number, username: string }[];

    constructor(room: Room)
    {
        super('RoomSecurityManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room      = room;

        this._rights    = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadRights();
    }

    protected async onDispose(): Promise<void>
    {
        this._rights = [];
    }

    public isOwner(user: User): boolean
    {
        if(!user) return false;

        if(this._room.details.ownerId === user.id || user.hasPermission(PermissionList.ANY_ROOM_OWNER)) return true;

        return false;
    }

    public hasRights(userId: number): boolean
    {
        if(!userId) return false;

        if(userId === this._room.details.ownerId) return true;
        
        const totalRights = this._rights.length;

        if(!totalRights) return false;
        
        for(let i = 0; i < totalRights; i++)
        {
            const user = this._rights[i];

            if(!user) continue;

            if(user.id === userId) return true;
        }

        return false;
    }

    public async giveRights(user: User, userId: number): Promise<void>
    {
        if(!user || !userId) return;

        if(!user.unit.isOwner()) return;

        const offlineUser = await Emulator.gameManager.userManager.getOfflineUserById(userId);

        if(!offlineUser) return;

        await RoomRightsDao.giveRights(this._room.id, userId);

        const right = { id: offlineUser.id, username: offlineUser.details.username };

        this._rights.push(right);

        this.giveRightsNotification(right);

        if(offlineUser.unit) offlineUser.unit.loadRights();
    }

    public async removeAllRights(user: User): Promise<void>
    {
        if(!user) return;

        if(!user.unit.isOwner()) return;

        const totalRights = this._rights.length;

        if(!totalRights) return;

        for(let i = 0; i < totalRights; i++)
        {
            const right = this._rights[i];

            if(!right) continue;

            this._rights.splice(i, 1);

            this.removeRightsNotification(right.id);
        }

        await RoomRightsDao.removeAllRights(this._room.id);
    }

    public async removeRights(user: User, ...userIds: number[]): Promise<void>
    {
        if(!user || !userIds) return;

        const ids = [ ...userIds ];

        const totalIds = ids.length;

        if(!totalIds) return;

        const totalRights = this._rights.length;

        if(!totalRights) return;

        if(!user.unit.isOwner() && totalIds !== 1 && ids[0] !== user.id) return;

        const validatedIds: number[] = [];

        for(let i = 0; i < totalIds; i++)
        {
            const userId = ids[i];

            if(!userId) continue;

            for(let j = 0; j < totalRights; j++)
            {
                const right = this._rights[j];

                if(!right) continue;

                if(right.id !== userId) continue;

                validatedIds.push(userId);

                this._rights.splice(j, 1);

                this.removeRightsNotification(userId);

                const user = Emulator.gameManager.userManager.getUserById(userId);

                if(!user) continue;

                user.unit.loadRights();

                break;
            }
        }

        if(validatedIds.length) await RoomRightsDao.removeRights(this._room.id, ...validatedIds);
    }

    private giveRightsNotification(right: { id: number, username: string }): void
    {
        if(!right || !right.id || !right.username) return;

        const activeUnits = this._room.unitManager.units;

        if(!activeUnits) return;
        
        const totalActiveUnits = activeUnits.length;

        if(!totalActiveUnits) return;

        for(let i = 0; i < totalActiveUnits; i++)
        {
            const unit = activeUnits[i];

            if(!unit) continue;

            if(!unit.isOwner()) continue;

            unit.user.connections.processOutgoing(new RoomRightsListAddComposer(this._room, right));
        }
    }

    private removeRightsNotification(userId: number): void
    {
        if(!userId) return;

        const activeUnits = this._room.unitManager.units;

        if(!activeUnits) return;
        
        const totalActiveUnits = activeUnits.length;

        if(!totalActiveUnits) return;

        for(let i = 0; i < totalActiveUnits; i++)
        {
            const unit = activeUnits[i];

            if(!unit) continue;

            if(!unit.isOwner()) continue;

            unit.user.connections.processOutgoing(new RoomRightsListRemoveComposer(this._room, userId));
        }
    }

    private async loadRights(): Promise<void>
    {
        this._rights = [];

        const results = await RoomRightsDao.loadRights(this._room.id);

        if(results)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

                    this._rights.push({ id: result.user.id, username: result.user.username });
                }
            }
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get rights(): { id: number, username: string }[]
    {
        return this._rights;
    }
}