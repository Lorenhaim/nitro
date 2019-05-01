import { FindConditions, getManager, In, Like, MoreThan } from 'typeorm';
import { RoomEntity, UserDao } from '../../../database';
import { Emulator } from '../../../Emulator';
import { OutgoingPacket } from '../../../packets';
import { NavigatorListCollapsed, NavigatorListMode, NavigatorListOptions } from '../list';
import { NavigatorTab } from '../NavigatorTab';
import { NavigatorSearchAction } from './NavigatorSearchAction';

export class NavigatorSearchResult
{
    private _tab: NavigatorTab;
    private _query: string;

    private _resultQuery: string;
    private _resultName: string;

    private _action: NavigatorSearchAction;
    private _listOptions: NavigatorListOptions;

    private _rooms: RoomEntity[];

    constructor(tab: NavigatorTab, query: string, action: NavigatorSearchAction, listOptions: NavigatorListOptions)
    {
        if(!(tab instanceof NavigatorTab)) throw new Error('invalid_tab');

        this._tab           = tab;
        this._query         = query || null;

        this._resultQuery   = null;
        this._resultName    = null;

        this._action        = action || NavigatorSearchAction.NONE;
        this._listOptions   = {
            collapsed: listOptions.collapsed || NavigatorListCollapsed.TRUE,
            mode: listOptions.mode || NavigatorListMode.LIST,
            showHidden: listOptions.showHidden || false
        };

        this._rooms         = [];
    }

    public async loadResults(): Promise<void>
    {
        if(this._query)
        {
            const parts = this._query.split(':');

            const totalParts = parts.length;

            if(totalParts)
            {
                let partOne   = parts[0];
                let partTwo   = parts[1];
                let partThree = parts[2];

                if(partOne && !partTwo)
                {
                    const temp = partOne;

                    partOne = 'anything';
                    partTwo = temp;
                }

                if(partOne && partTwo)
                {
                    switch(partOne)
                    {
                        case 'popularNow':
                            await this.loadPopularRooms();

                            this._resultQuery   = `popularNow`;
                            this._resultName    = partThree || `Popular Now`;
                            break;
                        case 'category':
                            const categoryId = parseInt(partTwo);

                            await this.loadByCategoryId(categoryId);

                            this._resultQuery   = `category:${ categoryId }`;
                            this._resultName    = partThree || `Category Search`;

                            break;
                        case 'roomname':
                            await this.loadByRoomName(partTwo);

                            this._resultQuery   = `roomname:${ partTwo }`;
                            this._resultName    = partThree || `Room Name: ${ partTwo }`;
                            
                            break;
                        case 'owner':
                            await this.loadByUsername(partTwo);

                            this._resultQuery   = `owner:${ partTwo }`;
                            this._resultName    = partThree || `Owner: ${ partTwo }`;
                            
                            break;
                        case 'anything':
                            await this.loadByAnything(partTwo);

                            this._resultQuery   = `anything:${ partTwo }`;
                            this._resultName    = `Text Search`;
                            
                            break;
                    }
                }
            }
        }
    }

    private async loadPopularRooms(): Promise<void>
    {
        const where: FindConditions<RoomEntity> = {};

        where.usersNow = MoreThan(0);

        if(this._tab.categoryIds.length) where.categoryId = In(this._tab.categoryIds);

        const results = await getManager().find(RoomEntity, {
            where,
            relations: ['user'],
            order: {
                usersNow: 'DESC'
            }
        });

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._rooms.push(results[i]);
        }
    }

    private async loadByCategoryId(categoryId: number): Promise<void>
    {
        if(categoryId)
        {
            const results = await getManager().find(RoomEntity, {
                where: {
                    categoryId: categoryId
                },
                relations: ['user'],
                order: {
                    usersNow: 'DESC'
                }
            });

            if(results)
            {
                const totalResults = results.length;

                if(totalResults) for(let i = 0; i < totalResults; i++) this._rooms.push(results[i]);
            }
        }
    }

    private async loadByRoomName(roomName: string): Promise<void>
    {
        if(roomName)
        {
            const where: FindConditions<RoomEntity> = {};

            where.name = Like(roomName + '%');

            if(this._tab.categoryIds.length) where.categoryId = In(this._tab.categoryIds);

            const results = await getManager().find(RoomEntity, {
                where,
                relations: ['user'],
                order: {
                    usersNow: 'DESC'
                }
            });

            if(results)
            {
                const totalResults = results.length;

                if(totalResults) for(let i = 0; i < totalResults; i++) this._rooms.push(results[i]);
            }
        }
    }

    private async loadByUsername(username: string): Promise<void>
    {
        if(username)
        {
            const userId = await UserDao.getIdByUsername(username);

            if(userId)
            {
                const where: FindConditions<RoomEntity> = {};

                where.ownerId = userId;

                if(this._tab.categoryIds.length) where.categoryId = In(this._tab.categoryIds);

                const results = await getManager().find(RoomEntity, {
                    where,
                    relations: ['user'],
                    order: {
                        usersNow: 'DESC'
                    }
                });

                if(results)
                {
                    const totalResults = results.length;

                    if(totalResults) for(let i = 0; i < totalResults; i++) this._rooms.push(results[i]);
                }
            }
        }
    }

    private async loadByAnything(search: string): Promise<void>
    {
        if(search)
        {
            const where: FindConditions<RoomEntity> = {};

            where.name          = Like(search + '%');
            //where.description   = Like(search + '%');

            if(this._tab.categoryIds.length) where.categoryId = In(this._tab.categoryIds);

            const results = await getManager().find(RoomEntity, {
                where,
                relations: ['user'],
                order: {
                    usersNow: 'DESC'
                }
            });

            if(results)
            {
                const totalResults = results.length;

                if(totalResults) for(let i = 0; i < totalResults; i++) this._rooms.push(results[i]);
            }
        }
    }

    public parseBytes(): number[]
    {
        const packet = new OutgoingPacket(null);

        packet
            .writeString(this._resultQuery)
            .writeString(this._resultName)
            .writeInt(this._action)
            .writeBoolean(this._listOptions.collapsed === NavigatorListCollapsed.TRUE)
            .writeInt(this._listOptions.mode);
        
        const totalRooms = this._rooms.length;

        if(totalRooms)
        {
            packet.writeInt(totalRooms);

            for(let i = 0; i < totalRooms; i++)
            {
                const room      = this._rooms[i];
                const category  = Emulator.gameManager.navigatorManager.getCategory(room.categoryId);

                packet.writeInt(room.id).writeString(room.name);

                if(category && category.isPublic) packet.writeInt(0).writeString(null);
                else packet.writeInt(room.user.id).writeString(room.user.username);

                //if(!this._listOptions.showInvisible && room.details.state === RoomState.INVISIBLE) return;

                let base = 0;

                if(!category || !category.isPublic) base += 8;

                if(room.allowPets) base += 16;

                packet
                    .writeInt(room.state)
                    .writeInt(room.usersNow)
                    .writeInt(room.usersMax)
                    .writeString(room.description)
                    .writeInt(0)
                    .writeInt(0) // score
                    .writeInt(0) // ranking
                    .writeInt(category.id || 0)
                    .writeInt(0) //tags foreach, string
                    .writeInt(base);
            }
        }
        else
        {
            packet.writeInt(0);
        }

        return packet.bytes;
    }

    public get rooms(): RoomEntity[]
    {
        return this._rooms;
    }
}