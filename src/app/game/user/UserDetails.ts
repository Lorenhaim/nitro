import { getManager } from 'typeorm';
import { TimeHelper } from '../../common';
import { UserEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { UnitInfoComposer, UserFigureComposer, UserHomeRoomComposer, UserRespectComposer } from '../../packets';
import { UnitAction } from '../unit';
import { NavigatorSettings } from './interfaces';
import { User } from './User';

export class UserDetails
{
    private _user: User;
    private _entity: UserEntity;

    private _firstLoginOfDay: boolean;

    constructor(entity: UserEntity, user: User)
    {
        if(!(entity instanceof UserEntity) || !(user instanceof User)) throw new Error('invalid_user');

        this._user              = user;
        this._entity            = entity;

        this._firstLoginOfDay   = false;
    }

    public save(): void
    {
        Emulator.gameScheduler.saveUser(this._entity);
    }

    public async saveNow(destroy: boolean = false): Promise<void>
    {
        await getManager().save(this._entity);

        if(destroy) this._entity = null;
    }

    public updateFigure(figure: string, gender: 'M' | 'F'): void
    {
        if(!figure || !gender) return;
        
        this._entity.figure = figure;
        this._entity.gender = gender === 'M' ? 'M' : 'F';

        this.save();

        if(this._user.connections) this._user.connections.processOutgoing(new UserFigureComposer());

        if(this._user.unit && this._user.unit.room) this._user.unit.room.unitManager.processOutgoing(new UnitInfoComposer(this._user.unit));

        if(this._user.messenger) this._user.messenger.updateAllFriends();
    }

    public updateHomeRoom(roomId: number): void
    {
        this._entity.info.homeRoom = roomId;

        this.save();

        if(this._user.connections) this._user.connections.processOutgoing(new UserHomeRoomComposer(true));
    }

    public updateMotto(motto: string): void
    {
        this._entity.motto = motto;

        this.save();

        if(this._user.unit && this._user.unit.room) this._user.unit.room.unitManager.processOutgoing(new UnitInfoComposer(this._user.unit));
    }

    public updateOnline(flag: boolean): void
    {
        if(flag)
        {
            this._entity.online     = '1';
            this._entity.lastOnline = TimeHelper.now;

            if(this._entity.statistics.loginStreakLast)
            {
                if(TimeHelper.isNextDay(TimeHelper.now, this._entity.statistics.loginStreakLast))
                {
                    this._firstLoginOfDay = true;

                    this._entity.statistics.loginStreak++;
                }
                
                else if(!TimeHelper.isToday(this._entity.statistics.loginStreakLast))
                {
                    this._firstLoginOfDay = true;

                    this._entity.statistics.loginStreak = 1;
                }
            }
            else
            {
                this._firstLoginOfDay = true;

                this._entity.statistics.loginStreak = 1;
            }

            this._entity.statistics.loginStreakLast = TimeHelper.now;

            this._entity.statistics.totalLogins++;
        }
        else
        {
            this._entity.online = '0';

            if(this._entity.statistics.loginStreakLast)
            {
                const daysBetween = TimeHelper.between(this._entity.statistics.loginStreakLast, TimeHelper.now, 'days');

                if(daysBetween > 0) this._entity.statistics.loginStreak += daysBetween;

                this._entity.statistics.totalSecondsOnline += TimeHelper.between(this._entity.statistics.loginStreakLast, TimeHelper.now, 'seconds');
            }
        }

        if(this._user.messenger) this._user.messenger.updateAllFriends();

        this.save();
    }

    public updateNavigator(navigatorSettings: NavigatorSettings)
    {
        this._entity.info.navigatorX             = navigatorSettings.x || 100;
        this._entity.info.navigatorY             = navigatorSettings.y || 100;
        this._entity.info.navigatorWidth         = navigatorSettings.width || 435;
        this._entity.info.navigatorHeight        = navigatorSettings.height || 535;
        this._entity.info.navigatorSearchOpen    = navigatorSettings.searchOpen ? '1' : '0';

        this.save();
    }

    public giveRespect(user: User): void
    {
        if(!user) return;

        if(this._entity.info.respectsRemaining > 0) this._entity.info.respectsRemaining--;

        this.save();

        user.details.receiveRespect(this._user);

        this._user.unit.location.action(UnitAction.THUMB_UP);
    }

    public receiveRespect(user: User): void
    {
        if(!user) return;

        this._entity.info.respectsReceived++;

        this.save();

        if(this._user.unit.room) this._user.unit.room.unitManager.processOutgoing(new UserRespectComposer(this._user));
    }

    public get user(): User
    {
        return this._user;
    }

    public get entity(): UserEntity
    {
        return this._entity;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get username(): string
    {
        return this._entity.username;
    }

    public get motto(): string
    {
        return this._entity.motto;
    }

    public get gender(): 'M' | 'F'
    {
        return this._entity.gender;
    }

    public get figure(): string
    {
        return this._entity.figure;
    }

    public get rankId(): number
    {
        return this._entity.rankId || 0;
    }

    public get online(): boolean
    {
        return this._entity.online === '1';
    }

    public get lastOnline(): Date
    {
        return this._entity.lastOnline;
    }

    public get machineId(): string
    {
        return this._entity.machineId;
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }

    public get homeRoom(): number
    {
        return this._entity.info.homeRoom || 0;
    }

    public get clubActive(): boolean
    {
        return this.clubExpiration && TimeHelper.between(TimeHelper.now, this.clubExpiration, 'seconds') > 0;
    }

    public get clubExpiration(): Date
    {
        return this._entity.info.clubExpiration;
    }

    public get respectsReceived(): number
    {
        return this._entity.info.respectsReceived || 0;
    }

    public get respectsRemaining(): number
    {
        return this._entity.info.respectsRemaining || 0;
    }

    public get respectsPetRemaining(): number
    {
        return this._entity.info.respectsPetRemaining || 0;
    }

    public get achievementScore(): number
    {
        return this._entity.info.achievementScore || 0;
    }

    public get friendRequestsDisabled(): boolean
    {
        return this._entity.info.friendRequestsDisabled === '1';
    }

    public get navigatorX(): number
    {
        return this._entity.info.navigatorX || 100;
    }

    public get navigatorY(): number
    {
        return this._entity.info.navigatorY || 100;
    }

    public get navigatorWidth(): number
    {
        return this._entity.info.navigatorWidth || 435;
    }

    public get navigatorHeight(): number
    {
        return this._entity.info.navigatorHeight || 535;
    }

    public get navigatorSearchOpen(): boolean
    {
        return this._entity.info.navigatorSearchOpen === '1';
    }

    public get navigatorSettings(): NavigatorSettings
    {
        return {
            x: this.navigatorX,
            y: this.navigatorY,
            width: this.navigatorWidth,
            height: this.navigatorHeight,
            searchOpen: this.navigatorSearchOpen
        };
    }

    public get loginStreak(): number
    {
        return this._entity.statistics.loginStreak;
    }

    public get loginStreakLast(): Date
    {
        return this._entity.statistics.loginStreakLast;
    }

    public get loginStreakLifetime(): number
    {
        return this._entity.statistics.loginStreakLifetime;
    }

    public get totalSecondsOnline(): number
    {
        return this._entity.statistics.totalSecondsOnline;
    }

    public get totalLogins(): number
    {
        return this._entity.statistics.totalLogins;
    }

    public get firstLoginOfDay(): boolean
    {
        return this._firstLoginOfDay;
    }
}