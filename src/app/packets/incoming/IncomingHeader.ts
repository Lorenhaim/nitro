export enum IncomingHeader
{
    // WebSocket Headers
    SECURITY_LOGIN                 = 6000,
    SECURITY_LOGOUT                = 6001,
    SECURITY_REQUEST               = 6002,
    SYSTEM_CONFIG                  = 6003,
    VALIDATOR                      = 6004,
    SECURITY_REGISTER              = 6005,

    // NetSocket Headers
    ACHIEVEMENT_LIST               = 219,
    BOT_INFO                       = 1986,
    BOT_PICKUP                     = 3323,
    BOT_PLACE                      = 1592,
    BOT_SETTINGS_SAVE              = 2624,
    CAMERA_CONFIGURATION           = 796,
    CAMERA_SAVE                    = 3226,
    CAMERA_THUMBNAIL               = 1982,
    CATALOG_CLUB                   = 3285,
    CATALOG_MODE                   = 1195,
    CATALOG_PAGE                   = 412,
    CATALOG_PURCHASE               = 3492,
    CLIENT_LATENCY                 = 295,
    CLIENT_LATENCY_MEASURE         = 96,
    CLIENT_PONG                    = 2596,
    CLIENT_TOOLBAR_TOGGLE          = 2313,
    CLIENT_VARIABLES               = 1053,
    CROSS_DOMAIN                   = 26979,
    DISCOUNT_CONFIG                = 223,
    EVENT_TRACKER                  = 3457,
    FIND_FRIENDS                   = 516,
    GAMES_INIT                     = 2914,
    GAMES_LIST                     = 741,
    GIFT_CONFIG                    = 418,
    GROUP_ADMIN_ADD                = 2894,
    GROUP_ADMIN_REMOVE             = 722,
    GROUP_FORUM_INFO               = 3149,
    GROUP_FORUM_LIST               = 873,
    GROUP_FORUM_THREADS            = 436,
    GROUP_INFO                     = 2991,
    GROUP_MEMBER_REMOVE            = 3593,
    GROUP_MEMBERS                  = 312,
    GROUP_MEMBERSHIPS              = 367,
    GROUP_REQUEST                  = 998,
    GROUP_REQUEST_ACCEPT           = 3386,
    GROUP_REQUEST_DECLINE          = 1894,
    GROUP_SETTINGS                 = 1004,
    GROUP_CREATE_OPTIONS           = 798,
    HOTELVIEW_CAMPAIGNS            = 2912,
    HOTELVIEW_NEWS                 = 1827,
    HOTELVIEW_VISIT                = 105,
    ITEM_CLOTHING_REDEEM           = 3374,
    ITEM_COLOR_WHEEL_CLICK         = 2144,
    ITEM_DICE_CLICK                = 1990,
    ITEM_DICE_CLOSE                = 1533,
    ITEM_DIMMER_SAVE               = 1648,
    ITEM_DIMMER_SETTINGS           = 2813,
    ITEM_DIMMER_TOGGLE             = 2296,
    ITEM_EXCHANGE_REDEEM           = 3115,
    ITEM_FLOOR_CLICK               = 99,
    ITEM_FLOOR_UPDATE              = 248,
    ITEM_PAINT                     = 711,
    ITEM_PICKUP                    = 3456,
    ITEM_PLACE                     = 1258,
    ITEM_STACK_HELPER              = 3839,
    ITEM_WALL_CLICK                = 210,
    ITEM_WALL_UPDATE               = 168,
    MARKETPLACE_CONFIG             = 2597,
    MESSENGER_ACCEPT               = 137,
    MESSENGER_CHAT                 = 3567,
    MESSENGER_DECLINE              = 2890,
    MESSENGER_FRIENDS              = 1523,
    MESSENGER_INIT                 = 2781,
    MESSENGER_RELATIONSHIPS        = 2138,
    MESSENGER_RELATIONSHIPS_UPDATE = 3768,
    MESSENGER_REMOVE               = 1689,
    MESSENGER_REQUEST              = 3157,
    MESSENGER_REQUESTS             = 2448,
    MESSENGER_ROOM_INVITE          = 1276,
    MESSENGER_SEARCH               = 1210,
    MESSENGER_UPDATES              = 1419,
    MOD_TOOL_USER_INFO             = 3295,
    NAVIGATOR_CATEGORIES           = 3027,
    NAVIGATOR_INIT                 = 2110,
    NAVIGATOR_PROMOTED_ROOMS       = 2908,
    NAVIGATOR_SEARCH               = 249,
    NAVIGATOR_SEARCH_CLOSE         = 1834,
    NAVIGATOR_SEARCH_OPEN          = 637,
    NAVIGATOR_SEARCH_SAVE          = 2226,
    NAVIGATOR_SETTINGS             = 1782,
    NAVIGATOR_SETTINGS_SAVE        = 3159,
    PET_INFO                       = 2934,
    PET_PICKUP                     = 1581,
    PET_PLACE                      = 2647,
    PET_RIDE                       = 1036,
    RECYCLER_PRIZES                = 398,
    RELEASE_VERSION                = 4000,
    REPORT                         = 1691,
    ROOM_CREATE                    = 2752,
    ROOM_DELETE                    = 532,
    ROOM_DOORBELL                  = 1644,
    ROOM_ENTER                     = 2312,
    ROOM_FAVORITE                  = 3817,
    ROOM_INFO                      = 2230,
    ROOM_LIKE                      = 3582,
    ROOM_MODEL                     = 3898,
    ROOM_MODEL_BLOCKED_TILES       = 1687,
    ROOM_MODEL_DOOR                = 3559,
    ROOM_MODEL_SAVE                = 875,
    ROOM_MODEL2                    = 2300,
    ROOM_RIGHTS_GIVE               = 808,
    ROOM_RIGHTS_LIST               = 3385,
    ROOM_RIGHTS_REMOVE             = 2064,
    ROOM_RIGHTS_REMOVE_ALL         = 2683,
    ROOM_RIGHTS_REMOVE_OWN         = 3182,
    ROOM_SETTINGS                  = 3129,
    ROOM_SETTINGS_SAVE             = 1969,
    ROOM_UNFAVORITE                = 309,
    SECURITY_MACHINE               = 2490,
    SECURITY_TICKET                = 2419,
    UNIT_ACTION                    = 2456,
    UNIT_CHAT                      = 1314,
    UNIT_CHAT_SHOUT                = 2085,
    UNIT_CHAT_WHISPER              = 1543,
    UNIT_DANCE                     = 2080,
    UNIT_DROP_HAND_ITEM            = 2814,
    UNIT_GIVE_HANDITEM             = 2941,
    UNIT_KICK                      = 1320,
    UNIT_LOOK                      = 3301,
    UNIT_SIGN                      = 1975,
    UNIT_SIT                       = 2235,
    UNIT_TYPING                    = 1597,
    UNIT_TYPING_STOP               = 1474,
    UNIT_WALK                      = 3320,
    USER_BADGES                    = 2769,
    USER_BADGES_CURRENT            = 2091,
    USER_BADGES_CURRENT_UPDATE     = 644,
    USER_BOTS                      = 3848,
    USER_CLUB                      = 3166,
    USER_CURRENCY                  = 273,
    USER_FIGURE                    = 2730,
    USER_FOLLOW                    = 3997,
    USER_HOME_ROOM                 = 1740,
    USER_IGNORED                   = 1371,
    USER_INFO                      = 357,
    USER_ITEMS                     = 3150,
    USER_ITEMS_TEST                = 3500,
    USER_MOTTO                     = 2228,
    USER_ONLINE                    = 3878,
    USER_OUTFIT_SAVE               = 800,
    USER_OUTFITS                   = 2742,
    USER_PETS                      = 3095,
    USER_PROFILE                   = 3265,
    USER_RESPECT                   = 2694,
    USER_SETTINGS                  = 2388,
    USER_TAGS                      = 17,
    WIRED_EFFECT_SAVE              = 2281,
    WIRED_TRIGGER_SAVE             = 1520
}