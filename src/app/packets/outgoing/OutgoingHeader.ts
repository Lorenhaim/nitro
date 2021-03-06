export enum OutgoingHeader
{
    // WebSocket Headers
    SECURITY_LOGOUT            = 6101,
    SYSTEM_CONFIG              = 6103,
    VALIDATOR                  = 6104,
    SECURITY_REGISTER          = 6105,

    // NetSocket Headers
    ACHIEVEMENT_LIST             = 305,
    BUILDERS_CLUB_EXPIRED        = 1452,
    CAMERA_PRICE                 = 3878,
    CAMERA_THUMBNAIL_SAVED       = 3595,
    CAMERA_URL                   = 3696,
    CATALOG_CLUB                 = 2405,
    CATALOG_MODE                 = 3828,
    CATALOG_PAGE                 = 804,
    CATALOG_PAGES                = 1032,
    CATALOG_PURCHASE             = 869,
    CATALOG_PURCHASE_FAILED      = 1404,
    CATALOG_PURCHASE_UNAVAILABLE = 3770,
    CATALOG_SEARCH               = 3388,
    CATALOG_SOLD_OUT             = 377,
    CATALOG_UPDATED              = 1866,
    CLIENT_LATENCY               = 10,
    CLIENT_PING                  = 3928,
    DISCOUNT_CONFIG              = 2347,
    FIRST_LOGIN_OF_DAY           = 793,
    GAME_CENTER_ACHIEVEMENTS     = 2265,
    GAME_CENTER_GAME_LIST        = 222,
    GAME_CENTER_STATUS           = 2893,
    GENERIC_ALERT                = 3801,
    GENERIC_ALERT_MESSAGES       = 2035,
    GENERIC_ERROR                = 1600,
    GIFT_CONFIG                  = 2234,
    GROUP_BADGES                 = 2402,
    GROUP_CREATE_OPTIONS         = 2159,
    GROUP_FORUM_INFO             = 3011,
    GROUP_FORUM_LIST             = 3001,
    GROUP_FORUM_THREADS          = 1073,
    GROUP_INFO                   = 1702,
    GROUP_LIST                   = 420,
    GROUP_MEMBER                 = 265,
    GROUP_MEMBERS                = 1200,
    GROUP_MEMBERS_REFRESH        = 2445,
    GROUP_SETTINGS               = 3965,
    HOTEL_VIEW                   = 122,
    HOTEL_VIEW_CAMPAIGN          = 1745,
    HOTEL_VIEW_NEWS              = 286,
    ITEM_DIMMER_SETTINGS         = 2710,
    ITEM_EXTRA_DATA              = 2547,
    ITEM_FLOOR                   = 1778,
    ITEM_FLOOR_ADD               = 1534,
    ITEM_FLOOR_REMOVE            = 2703,
    ITEM_FLOOR_UPDATE            = 3776,
    ITEM_STACK_HELPER            = 2816,
    ITEM_STATE                   = 2376,
    ITEM_WALL                    = 1369,
    ITEM_WALL_ADD                = 2187,
    ITEM_WALL_REMOVE             = 3208,
    ITEM_WALL_UPDATE             = 2009,
    MARKETPLACE_CONFIG           = 1823,
    MESSENGER_CHAT               = 1587,
    MESSENGER_CHAT_ERROR         = 896,
    MESSENGER_FRIENDS            = 3130,
    MESSENGER_INIT               = 1605,
    MESSENGER_RELATIONSHIPS      = 2016,
    MESSENGER_REQUEST            = 2219,
    MESSENGER_REQUEST_ERROR      = 892,
    MESSENGER_REQUESTS           = 280,
    MESSENGER_ROOM_INVITE        = 3870,
    MESSENGER_SEARCH             = 973,
    MESSENGER_UPDATE             = 2800,
    MODERATION_REPORT_DISABLED   = 1651,
    MODERATION_TOOL              = 2696,
    MODERATION_TOPICS            = 325,
    MODERATION_USER_INFO         = 2866,
    NAVIGATOR_CATEGORIES         = 1562,
    NAVIGATOR_COLLAPSED          = 1543,
    NAVIGATOR_EVENT_CATEGORIES   = 3244,
    NAVIGATOR_LIFTED             = 3104,
    NAVIGATOR_METADATA           = 3052,
    NAVIGATOR_SEARCH             = 2690,
    NAVIGATOR_SEARCHES           = 3984,
    NAVIGATOR_SETTINGS           = 518,
    NOTIFICATION                 = 1992,
    PET_INFO                     = 2901,
    RECYCLER_PRIZES              = 3164,
    ROLLING                      = 3207,
    ROOM_ACCESS_DENIED           = 878,
    ROOM_CREATED                 = 1304,
    ROOM_DOORBELL_ADD            = 2309,
    ROOM_DOORBELL_CLOSE          = 3783,
    ROOM_ENTER                   = 758,
    ROOM_ENTER_ERROR             = 899,
    ROOM_INFO                    = 687,
    ROOM_INFO_OWNER              = 749,
    ROOM_MAP                     = 2753,
    ROOM_MODEL                   = 1301,
    ROOM_MODEL_BLOCKED_TILES     = 3990,
    ROOM_MODEL_DOOR              = 1664,
    ROOM_MODEL_NAME              = 2031,
    ROOM_OWNER                   = 339,
    ROOM_PAINT                   = 2454,
    ROOM_PROMOTION               = 2274,
    ROOM_QUEUE_STATUS            = 2208,
    ROOM_RIGHTS                  = 780,
    ROOM_RIGHTS_LIST             = 1284,
    ROOM_RIGHTS_LIST_ADD         = 2088,
    ROOM_RIGHTS_LIST_REMOVE      = 1327,
    ROOM_SCORE                   = 482,
    ROOM_SETTINGS                = 1498,
    ROOM_SETTINGS_CHAT           = 1191,
    ROOM_SETTINGS_SAVE           = 948,
    ROOM_SETTINGS_SAVE_ERROR     = 1555,
    ROOM_SETTINGS_UPDATED        = 3297,
    ROOM_SPECTATOR               = 1033,
    ROOM_STACK_HEIGHT            = 558,
    ROOM_THICKNESS               = 3547,
    SECURITY_DEBUG               = 3284,
    SECURITY_MACHINE             = 1488,
    SECURITY_TICKET              = 2491,
    SECURITY_UNKNOWN2            = 2833,
    UNIT                         = 374,
    UNIT_ACTION                  = 1631,
    UNIT_CHANGE_NAME             = 2182,
    UNIT_CHAT                    = 1446,
    UNIT_CHAT_SHOUT              = 1036,
    UNIT_CHAT_WHISPER            = 2704,
    UNIT_DANCE                   = 2233,
    UNIT_EFFECT                  = 1167,
    UNIT_HAND_ITEM               = 1474,
    UNIT_IDLE                    = 1797,
    UNIT_INFO                    = 3920,
    UNIT_REMOVE                  = 2661,
    UNIT_STATUS                  = 1640,
    UNIT_TYPING                  = 1717,
    USER_ACHIEVEMENT_SCORE       = 1968,
    USER_BADGES                  = 717,
    USER_BADGES_ADD              = 2493,
    USER_BADGES_CURRENT          = 1087,
    USER_BOT_ADD                 = 1352,
    USER_BOT_REMOVE              = 233,
    USER_BOTS                    = 3086,
    USER_CLOTHING                = 1450,
    USER_CLUB                    = 954,
    USER_CREDITS                 = 3475,
    USER_CURRENCY                = 2018,
    USER_EFFECTS                 = 340,
    USER_FAVORITE_ROOM           = 2524,
    USER_FAVORITE_ROOM_COUNT     = 151,
    USER_FIGURE                  = 2429,
    USER_FOWARD_ROOM             = 160,
    USER_HOME_ROOM               = 2875,
    USER_IGNORED                 = 126,
    USER_INFO                    = 2725,
    USER_ITEM_ADD                = 2103,
    USER_ITEM_REMOVE             = 159,
    USER_ITEMS                   = 994,
    USER_ITEMS_REFRESH           = 3151,
    USER_OUTFITS                 = 3315,
    USER_PERKS                   = 2586,
    USER_PERMISSIONS             = 411,
    USER_PET_ADD                 = 2101,
    USER_PET_REMOVE              = 3253,
    USER_PETS                    = 3522,
    USER_PROFILE                 = 3898,
    USER_RESPECT                 = 2815,
    USER_RIGHTS                  = 2033,
    USER_SANCTION_STATUS         = 3679,
    USER_SETTINGS                = 513,
    WIRED_EFFECT_CONFIG          = 1434,
    WIRED_SAVE                   = 1155,
    WIRED_TRIGGER_CONFIG         = 383,
    TRADE                        = 2505,
    TRADE_ERROR                  = 217,
    TRADE_CLOSED                 = 1373,
    TRADE_UPDATE                 = 2024,
    TRADE_ACCEPTED               = 2568,
    TRADE_CONFIRM                = 2720,
    TRADE_COMPLETE               = 3128,
    TRADE_CLOSE                  = 1001
}