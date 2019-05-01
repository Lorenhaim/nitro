import { ConfigOptions } from './common';

export const Config: ConfigOptions = {
    general: {
        siteName: 'HabboAPI',
        siteUrl: 'http://emulator.habboapi.com:4200',
        production: 'PRODUCTION-201611291003-338511768'
    },
    captcha: {
        enabled: false,
        publicKey: '6LcyfpMUAAAAANq3ZBNaZ28xCNRP-31XOz3ol9QQ',
        secretKey: '6LcyfpMUAAAAABvBMaLv-5vHlGc7cTVCGNb-bGLl'
    },
    logging: {
        enabled: true,
        packets: {
            incoming: true,
            outgoing: true,
            unknown: true,
            unprepared: true
        },
        connections: {
            game: true,
            web: true
        }
    },
    client: {
        ip: 'emulator.habboapi.com',
        port: 1242,
        enabled: true,
        url: {
            figureData: 'http://emulator.habboapi.com:3000/gamedata/figuredata.xml',
            furniData: 'http://emulator.habboapi.com:3000/gamedata/furnidata.xml',
            productData: 'http://emulator.habboapi.com:3000/gamedata/productdata.txt',
            swf: 'http://emulator.habboapi.com:3000/local/edit/habbo/Habbo.swf',
            swfBase: 'http://emulator.habboapi.com:3000/gordon/',
            texts: 'http://emulator.habboapi.com:3000/gamedata/external_texts.txt',
            variables: 'http://emulator.habboapi.com:3000/gamedata/external_variables.txt'
        }
    },
    game: {
        enabled: true,
        ip: '0.0.0.0',
        port: 1242,
        ticket: {
            enabled: true,
            maxLength: 1,
            maxLengthType: 'minute',
            validateIp: false
        },
        login: {
            security: {
                validateProduction: true,
                validateVariables: false
            },
            alert: {
                enabled: false,
                message: 'Welcome to HabboAPI!',
                type: 'default'
            }
        },
        catalog: {
            maxPurchaseStack: 50
        },
        messenger: {
            maxFriends: 300,
            maxFriendsHabboClub: 500
        },
        rollerTick: 2000,
        pathfinder: {
            steps: {
                ignoreDoorTile: true,
                maxWalkingHeight: 2,
                allowDiagonals: true,
                checkItemBelow: true
            }
        },
        unit: {
            idleTimerMs: 600000,
            handItemMs: 300000,
            lookTimerMs: 4000
        }
    },
    web: {
        enabled: false,
        ip: '0.0.0.0',
        port: 443,
        ticket: {
            enabled: true,
            maxLength: 1,
            maxLengthType: 'day',
            validateIp: false
        }
    }
}