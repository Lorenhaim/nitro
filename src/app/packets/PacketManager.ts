import { Incoming, IncomingHeader } from './incoming';
import * as IncomingAchivement from './incoming/achievements';
import * as IncomingBot from './incoming/bot';
import * as IncomingCamera from './incoming/camera';
import * as IncomingCatalog from './incoming/catalog';
import * as IncomingClient from './incoming/client';
import * as IncomingGames from './incoming/games';
import * as IncomingGroup from './incoming/group';
import * as IncomingHotelView from './incoming/hotelview';
import * as IncomingModeration from './incoming/moderation';
import * as IncomingNavigator from './incoming/navigator';
import * as IncomingPet from './incoming/pet';
import * as IncomingRoom from './incoming/room';
import * as IncomingSecurity from './incoming/security';
import * as IncomingUser from './incoming/user';
import * as IncomingWebSocket from './incoming/websocket';

export class PacketManager
{
    private _handlers: { header: IncomingHeader | string, handler: typeof Incoming }[];

    constructor()
    {
        this._handlers = [];

        this.registerAchievements();
        this.registerBot();
        this.registerCamera();
        this.registerCatalog();
        this.registerClient();
        this.registerGames();
        this.registerGroup();
        this.registerSecurity();
        this.registerHotelView();
        this.registerNavigator();
        this.registerPet();
        this.registerRoom();
        this.registerMessenger();
        this.registerModeration();
        this.registerUser();
        this.registerWebSocket();
        this.registerWired();
    }

    public addHandler(header: IncomingHeader, handler: typeof Incoming)
    {
        const totalHandlers = this._handlers.length;

        for(let i = 0; i < totalHandlers; i++)
        {
            const existing = this._handlers[i];

            if(existing.header === header)
            {
                this._handlers.splice(i, 1);

                break;
            }
        }

        this._handlers.push({ header: header.toString(), handler });
    }

    public getHandler(header: IncomingHeader): typeof Incoming
    {
        let handler: typeof Incoming = null;

        const totalHandlers = this._handlers.length;

        for(let i = 0; i < totalHandlers; i++)
        {
            const existing = this._handlers[i];

            if(existing.header === header.toString())
            {
                handler = existing.handler;

                break;
            }
        }

        return handler;
    }

    private registerAchievements(): void
    {
        this.addHandler(IncomingHeader.ACHIEVEMENT_LIST, IncomingAchivement.AchievementsRequestEvent);
    }

    private registerBot(): void
    {
        this.addHandler(IncomingHeader.BOT_PLACE, IncomingBot.BotPlaceEvent);
        this.addHandler(IncomingHeader.BOT_PICKUP, IncomingBot.BotPickupEvent);
        this.addHandler(IncomingHeader.BOT_INFO, IncomingBot.BotInfoEvent);
        this.addHandler(IncomingHeader.BOT_SETTINGS_SAVE, IncomingBot.BotSettingsSaveEvent);
    }

    private registerCamera(): void
    {
        this.addHandler(IncomingHeader.CAMERA_CONFIGURATION, IncomingCamera.CameraConfigurationEvent);
        this.addHandler(IncomingHeader.CAMERA_SAVE, IncomingCamera.CameraSaveEvent);
        this.addHandler(IncomingHeader.CAMERA_THUMBNAIL, IncomingCamera.CameraThumbnailEvent);
    }

    private registerCatalog(): void
    {
        this.addHandler(IncomingHeader.CATALOG_MODE, IncomingCatalog.CatalogModeEvent);
        this.addHandler(IncomingHeader.CATALOG_PAGE, IncomingCatalog.CatalogPageEvent);
        this.addHandler(IncomingHeader.CATALOG_PURCHASE, IncomingCatalog.CatalogPurchaseEvent);
        this.addHandler(IncomingHeader.RECYCLER_PRIZES, IncomingCatalog.RecyclerPrizesEvent);
        this.addHandler(IncomingHeader.MARKETPLACE_CONFIG, IncomingCatalog.MarketplaceConfigEvent);
        this.addHandler(IncomingHeader.GIFT_CONFIG, IncomingCatalog.GiftConfigEvent);
        this.addHandler(IncomingHeader.DISCOUNT_CONFIG, IncomingCatalog.DiscountConfigEvent);
    }

    private registerClient(): void
    {
        this.addHandler(IncomingHeader.CLIENT_LATENCY, IncomingClient.ClientLatencyEvent);
        this.addHandler(IncomingHeader.CLIENT_PING, IncomingClient.ClientPingEvent);
        this.addHandler(IncomingHeader.RELEASE_VERSION, IncomingClient.ClientReleaseVersionEvent);
        this.addHandler(IncomingHeader.CLIENT_VARIABLES, IncomingClient.ClientVariablesEvent);
        this.addHandler(IncomingHeader.CROSS_DOMAIN, IncomingClient.ClientPolicyEvent);
        this.addHandler(IncomingHeader.EVENT_TRACKER, IncomingClient.ClientEventTrackerEvent);
    }

    private registerGames(): void
    {
        this.addHandler(IncomingHeader.GAMES_INIT, IncomingGames.GamesInitEvent);
        this.addHandler(IncomingHeader.GAMES_LIST, IncomingGames.GamesListEvent);
    }

    private registerGroup(): void
    {
        this.addHandler(IncomingHeader.GROUP_INFO, IncomingGroup.GroupInfoEvent);
        this.addHandler(IncomingHeader.GROUP_MEMBERS, IncomingGroup.GroupMembersEvent);
        this.addHandler(IncomingHeader.GROUP_SETTINGS, IncomingGroup.GroupSettingsEvent);
        this.addHandler(IncomingHeader.GROUP_ADMIN_ADD, IncomingGroup.GroupAdminAddEvent);
        this.addHandler(IncomingHeader.GROUP_ADMIN_REMOVE, IncomingGroup.GroupAdminRemoveEvent);
        this.addHandler(IncomingHeader.GROUP_MEMBER_REMOVE, IncomingGroup.GroupMemberRemoveEvent);
        this.addHandler(IncomingHeader.GROUP_REQUEST_ACCEPT, IncomingGroup.GroupRequestAcceptEvent);
        this.addHandler(IncomingHeader.GROUP_REQUEST_DECLINE, IncomingGroup.GroupRequestDeclineEvent);
        this.addHandler(IncomingHeader.GROUP_REQUEST, IncomingGroup.GroupRequestEvent);
        this.addHandler(IncomingHeader.GROUP_FORUM_INFO, IncomingGroup.GroupForumInfoEvent);
        this.addHandler(IncomingHeader.GROUP_FORUM_LIST, IncomingGroup.GroupForumListEvent);
        this.addHandler(IncomingHeader.GROUP_FORUM_THREADS, IncomingGroup.GroupForumThreadsEvent);
    }

    private registerSecurity(): void
    {
        this.addHandler(IncomingHeader.SECURITY_MACHINE, IncomingSecurity.SecurityMachineEvent);
        this.addHandler(IncomingHeader.SECURITY_TICKET, IncomingSecurity.SecurityTicketEvent);

        this.addHandler(IncomingHeader.SECURITY_LOGIN, IncomingSecurity.SecurityLoginEvent);
        this.addHandler(IncomingHeader.SECURITY_LOGOUT, IncomingSecurity.SecurityLogoutEvent);
        this.addHandler(IncomingHeader.SECURITY_REQUEST, IncomingSecurity.SecurityRequestEvent);
        this.addHandler(IncomingHeader.SECURITY_REGISTER, IncomingSecurity.SecurityRegisterEvent);
    }

    private registerHotelView(): void
    {
        this.addHandler(IncomingHeader.HOTELVIEW_CAMPAIGNS, IncomingHotelView.HotelViewCampaignsEvent);
        this.addHandler(IncomingHeader.HOTELVIEW_NEWS, IncomingHotelView.HotelViewNewsEvent);
        this.addHandler(IncomingHeader.HOTELVIEW_VISIT, IncomingHotelView.HotelViewEvent);
    }
    
    private registerNavigator(): void
    {
        // SEARCH
        this.addHandler(IncomingHeader.NAVIGATOR_SEARCH_CLOSE, IncomingNavigator.NavigatorSearchCloseEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SEARCH, IncomingNavigator.NavigatorSearchEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SEARCH_OPEN, IncomingNavigator.NavigatorSearchOpenEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SEARCH_SAVE, IncomingNavigator.NavigatorSearchSaveEvent);

        this.addHandler(IncomingHeader.NAVIGATOR_CATEGORIES, IncomingNavigator.NavigatorCategoriesEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_INIT, IncomingNavigator.NavigatorInitEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_PROMOTED_ROOMS, IncomingNavigator.NavigatorPromotedRoomsEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SETTINGS, IncomingNavigator.NavigatorSettingsEvent);
        this.addHandler(IncomingHeader.NAVIGATOR_SETTINGS_SAVE, IncomingNavigator.NavigatorSettingsSaveEvent);
    }

    private registerPet(): void
    {
        this.addHandler(IncomingHeader.PET_PLACE, IncomingPet.PetPlaceEvent);
        this.addHandler(IncomingHeader.PET_INFO, IncomingPet.PetInfoEvent);
        this.addHandler(IncomingHeader.PET_PICKUP, IncomingPet.PetPickupEvent);
        this.addHandler(IncomingHeader.PET_RIDE, IncomingPet.PetRideEvent);
    }

    private registerRoom(): void
    {
        this.addHandler(IncomingHeader.ROOM_CREATE, IncomingRoom.RoomCreateEvent);
        this.addHandler(IncomingHeader.ROOM_INFO, IncomingRoom.RoomInfoEvent);
        this.addHandler(IncomingHeader.ROOM_ENTER, IncomingRoom.RoomEnterEvent);
        this.addHandler(IncomingHeader.ROOM_MODEL, IncomingRoom.RoomModelEvent);
        this.addHandler(IncomingHeader.ROOM_MODEL2, IncomingRoom.RoomModelEvent);
        this.addHandler(IncomingHeader.UNIT_WALK, IncomingRoom.UnitWalkEvent);
        this.addHandler(IncomingHeader.UNIT_CHAT, IncomingRoom.UnitChatEvent);
        this.addHandler(IncomingHeader.UNIT_LOOK, IncomingRoom.UnitLookEvent);
        this.addHandler(IncomingHeader.UNIT_ACTION, IncomingRoom.UnitActionEvent);
        this.addHandler(IncomingHeader.UNIT_SIT, IncomingRoom.UnitSitEvent);
        this.addHandler(IncomingHeader.UNIT_SIGN, IncomingRoom.UnitSignEvent);
        this.addHandler(IncomingHeader.UNIT_TYPING, IncomingRoom.UnitTypingEvent);
        this.addHandler(IncomingHeader.UNIT_TYPING_STOP, IncomingRoom.UnitTypingStopEvent);
        this.addHandler(IncomingHeader.UNIT_DANCE, IncomingRoom.UnitDanceEvent);
        this.addHandler(IncomingHeader.UNIT_CHAT_SHOUT, IncomingRoom.UnitChatShoutEvent);
        this.addHandler(IncomingHeader.UNIT_CHAT_WHISPER, IncomingRoom.UnitChatWhisperEvent);
        this.addHandler(IncomingHeader.UNIT_KICK, IncomingRoom.RoomKickEvent);
        this.addHandler(IncomingHeader.ITEM_FLOOR_UPDATE, IncomingRoom.ItemFloorUpdateEvent);
        this.addHandler(IncomingHeader.ROOM_SETTINGS, IncomingRoom.RoomSettingsEvent);
        this.addHandler(IncomingHeader.ROOM_DOORBELL, IncomingRoom.RoomDoorbellEvent);
        this.addHandler(IncomingHeader.ITEM_PLACE, IncomingRoom.ItemPlaceEvent);
        this.addHandler(IncomingHeader.ITEM_FLOOR_CLICK, IncomingRoom.ItemFloorClickEvent);
        this.addHandler(IncomingHeader.ITEM_PICKUP, IncomingRoom.ItemPickupEvent);
        this.addHandler(IncomingHeader.ROOM_RIGHTS_GIVE, IncomingRoom.RoomRightsGiveEvent);
        this.addHandler(IncomingHeader.ROOM_RIGHTS_REMOVE, IncomingRoom.RoomRightsRemoveEvent);
        this.addHandler(IncomingHeader.ROOM_RIGHTS_REMOVE_OWN, IncomingRoom.RoomRightsRemoveOwnEvent);
        this.addHandler(IncomingHeader.ROOM_RIGHTS_REMOVE_ALL, IncomingRoom.RoomRightsRemoveAllEvent);
        this.addHandler(IncomingHeader.ROOM_RIGHTS_LIST, IncomingRoom.RoomRightsListEvent);
        this.addHandler(IncomingHeader.ITEM_WALL_UPDATE, IncomingRoom.ItemWallUpdateEvent);
        this.addHandler(IncomingHeader.ITEM_PAINT, IncomingRoom.ItemPaintEvent);
        this.addHandler(IncomingHeader.ITEM_WALL_CLICK, IncomingRoom.ItemWallClickEvent);
        this.addHandler(IncomingHeader.ITEM_CLOTHING_REDEEM, IncomingRoom.ItemClothingRedeemEvent);
        this.addHandler(IncomingHeader.ITEM_EXCHANGE_REDEEM, IncomingRoom.ItemExchangeRedeemEvent);
        this.addHandler(IncomingHeader.ITEM_DICE_CLICK, IncomingRoom.ItemDiceClickEvent);
        this.addHandler(IncomingHeader.ITEM_DICE_CLOSE, IncomingRoom.ItemDiceCloseEvent);
        this.addHandler(IncomingHeader.UNIT_GIVE_HANDITEM, IncomingRoom.UnitGiveHandItemEvent);
        this.addHandler(IncomingHeader.UNIT_DROP_HAND_ITEM, IncomingRoom.UnitDropHandItemEvent);
        this.addHandler(IncomingHeader.ROOM_SETTINGS_SAVE, IncomingRoom.RoomSettingsSaveEvent);
        this.addHandler(IncomingHeader.ITEM_STACK_HELPER, IncomingRoom.ItemStackHelperEvent);
        this.addHandler(IncomingHeader.ROOM_DELETE, IncomingRoom.RoomDeleteEvent);
        this.addHandler(IncomingHeader.ITEM_DIMMER_SETTINGS, IncomingRoom.ItemDimmerClickEvent);
        this.addHandler(IncomingHeader.ITEM_DIMMER_TOGGLE, IncomingRoom.ItemDimmerToggleEvent);
        this.addHandler(IncomingHeader.ITEM_DIMMER_SAVE, IncomingRoom.ItemDimmerSaveEvent);
        this.addHandler(IncomingHeader.ITEM_COLOR_WHEEL_CLICK, IncomingRoom.ItemColorWheelClickEvent);
        this.addHandler(IncomingHeader.ROOM_MODEL_BLOCKED_TILES, IncomingRoom.RoomModelBlockedTilesEvent);
        this.addHandler(IncomingHeader.ROOM_MODEL_DOOR, IncomingRoom.RoomModelDoorEvent);
        this.addHandler(IncomingHeader.ROOM_MODEL_SAVE, IncomingRoom.RoomModelSaveEvent);
    }

    private registerMessenger(): void
    {
        this.addHandler(IncomingHeader.MESSENGER_ACCEPT, IncomingUser.MessengerAcceptEvent);
        this.addHandler(IncomingHeader.MESSENGER_CHAT, IncomingUser.MessengerChatEvent);
        this.addHandler(IncomingHeader.MESSENGER_DECLINE, IncomingUser.MessengerDeclineEvent);
        this.addHandler(IncomingHeader.MESSENGER_FRIENDS, IncomingUser.MessengerFriendsEvent);
        this.addHandler(IncomingHeader.MESSENGER_INIT, IncomingUser.MessengerInitEvent);
        this.addHandler(IncomingHeader.MESSENGER_RELATIONSHIPS, IncomingUser.MessengerRelationshipsEvent);
        this.addHandler(IncomingHeader.MESSENGER_REMOVE, IncomingUser.MessengerRemoveEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUEST, IncomingUser.MessengerRequestEvent);
        this.addHandler(IncomingHeader.MESSENGER_REQUESTS, IncomingUser.MessengerRequestsEvent);
        this.addHandler(IncomingHeader.MESSENGER_SEARCH, IncomingUser.MessengerSearchEvent);
        this.addHandler(IncomingHeader.MESSENGER_RELATIONSHIPS_UPDATE, IncomingUser.MessengerRelationshipUpdateEvent);
        this.addHandler(IncomingHeader.MESSENGER_UPDATES, IncomingUser.MessengerUpdatesEvent);
        this.addHandler(IncomingHeader.MESSENGER_ROOM_INVITE, IncomingUser.MessengerRoomInviteEvent);
    }

    private registerModeration(): void
    {
        this.addHandler(IncomingHeader.MOD_TOOL_USER_INFO, IncomingModeration.ModerationUserInfoEvent);
        this.addHandler(IncomingHeader.REPORT, IncomingModeration.ModerationReportEvent);
    }

    private registerUser(): void
    {
        this.addHandler(IncomingHeader.USER_BADGES, IncomingUser.BadgesEvent);
        this.addHandler(IncomingHeader.USER_BADGES_CURRENT, IncomingUser.BadgesCurrentEvent);
        this.addHandler(IncomingHeader.USER_BADGES_CURRENT_UPDATE, IncomingUser.BadgesCurrentUpdateEvent);

        this.addHandler(IncomingHeader.USER_ITEMS, IncomingUser.UserItemsEvent);
        this.addHandler(IncomingHeader.USER_ITEMS_TEST, IncomingUser.UserItemsEvent);

        this.addHandler(IncomingHeader.USER_PETS, IncomingUser.UserPetsEvent);
        this.addHandler(IncomingHeader.USER_BOTS, IncomingUser.UserBotsEvent);

        this.addHandler(IncomingHeader.USER_RESPECT, IncomingUser.UserRespectEvent);

        this.addHandler(IncomingHeader.USER_CLUB, IncomingUser.UserClubEvent);
        this.addHandler(IncomingHeader.USER_CURRENCY, IncomingUser.UserCurrencyEvent);
        this.addHandler(IncomingHeader.USER_FIGURE, IncomingUser.UserFigureEvent);
        this.addHandler(IncomingHeader.USER_IGNORED, IncomingUser.UserIgnoredEvent);
        this.addHandler(IncomingHeader.USER_INFO, IncomingUser.UserInfoEvent);
        this.addHandler(IncomingHeader.USER_ONLINE, IncomingUser.UserOnlineEvent);
        this.addHandler(IncomingHeader.USER_PROFILE, IncomingUser.UserProfileEvent);
        this.addHandler(IncomingHeader.USER_SETTINGS, IncomingUser.UserSettingsEvent);
        this.addHandler(IncomingHeader.USER_TAGS, IncomingUser.UserTagsEvent);
        this.addHandler(IncomingHeader.USER_OUTFITS, IncomingUser.OutfitsEvent);
        this.addHandler(IncomingHeader.USER_OUTFIT_SAVE, IncomingUser.OutfitSaveEvent);
        this.addHandler(IncomingHeader.USER_MOTTO, IncomingUser.UserMottoEvent);
        this.addHandler(IncomingHeader.USER_HOME_ROOM, IncomingUser.UserHomeRoomEvent);
        this.addHandler(IncomingHeader.USER_FOLLOW, IncomingUser.UserFollowEvent);
    }

    private registerWebSocket(): void
    {
        this.addHandler(IncomingHeader.SYSTEM_CONFIG, IncomingWebSocket.SystemConfigEvent);
        this.addHandler(IncomingHeader.VALIDATOR, IncomingWebSocket.ValidatorEvent);
    }

    private registerWired(): void
    {
        this.addHandler(IncomingHeader.WIRED_EFFECT_SAVE, IncomingRoom.WiredEffectSaveEvent);
        this.addHandler(IncomingHeader.WIRED_TRIGGER_SAVE, IncomingRoom.WiredTriggerSaveEvent);
    }

    public get handlers(): { header: IncomingHeader | string, handler: typeof Incoming }[]
    {
        return this._handlers;
    }
}