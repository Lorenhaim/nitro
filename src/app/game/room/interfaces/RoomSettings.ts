import { RoomBanType } from './RoomBanType';
import { RoomChatMode } from './RoomChatMode';
import { RoomChatProtection } from './RoomChatProtection';
import { RoomChatSpeed } from './RoomChatSpeed';
import { RoomChatWeight } from './RoomChatWeight';
import { RoomKickType } from './RoomKickType';
import { RoomMuteType } from './RoomMuteType';
import { RoomState } from './RoomState';
import { RoomThickness } from './RoomThickness';
import { RoomTradeType } from './RoomTradeType';

export interface RoomSettings
{
    name: string;
    description: string;
    state: RoomState;
    password: string;
    usersMax: number;
    categoryId: number;
    totalTags: number;
    tags: string[];
    tradeType: RoomTradeType;
    allowPets: boolean;
    allowPetsEat: boolean;
    allowWalkThrough: boolean;
    hideWalls: boolean;
    thicknessWall: RoomThickness;
    thicknessFloor: RoomThickness;
    muteOption: RoomMuteType;
    kickOption: RoomKickType;
    banOption: RoomBanType;
    chatMode: RoomChatMode;
    chatWeight: RoomChatWeight;
    chatSpeed: RoomChatSpeed;
    chatDistance: number;
    chatProtection: RoomChatProtection;

}