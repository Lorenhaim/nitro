import moment = require('moment');

export interface ConfigOptions
{
    general: {
        siteName: string,
        siteUrl: string,
        production: string
    },
    captcha: {
        enabled: boolean,
        publicKey: string,
        secretKey: string
    },
    logging: {
        enabled: boolean,
        packets: {
            incoming: boolean,
            outgoing: boolean,
            unknown: boolean,
            unprepared: boolean,
            invalid: boolean
        },
        connections: {
            game: boolean,
            web: boolean
        }
    },
    client: {
        ip: string,
        port: number,
        enabled: boolean,
        url: {
            figureData: string,
            furniData: string,
            productData: string,
            swf: string,
            swfBase: string,
            texts: string,
            variables: string,
            avatarUrl: string
        }
    },
    game: {
        enabled: boolean,
        ip: string,
        port: number,
        ticket: {
            enabled: boolean,
            maxLength: number,
            maxLengthType: moment.unitOfTime.DurationConstructor,
            validateIp: boolean
        },
        login: {
            security: {
                validateProduction: boolean,
                validateVariables: boolean
            },
            alert: {
                enabled: boolean,
                message: string,
                type: string
            }
        },
        camera: {
            savePath: string,
            saveUrl: string
        },
        plugins: {
            enabled: boolean,
            path: string
        },
        catalog: {
            maxPurchaseStack: number
        }
        messenger: {
            maxFriends: number,
            maxFriendsHabboClub: number
        },
        rollerTick: number,
        pathfinder: {
            steps: {
                ignoreDoorTile: boolean,
                maxWalkingHeight: number,
                allowDiagonals: boolean,
                checkItemBelow: boolean
            }
        },
        rooms: {
            maxUnitsPerRoom: number
        },
        unit: {
            idleTimerMs: number,
            handItemMs: number,
            lookTimerMs: number,
            roamTimerMs: number
        },
        furni: {
            wired: {
                maxItems: number
            }
        }
    },
    web: {
        enabled: boolean,
        ip: string,
        port: number,
        ticket: {
            enabled: boolean,
            maxLength: number,
            maxLengthType: moment.unitOfTime.DurationConstructor,
            validateIp: boolean
        }
    }
}