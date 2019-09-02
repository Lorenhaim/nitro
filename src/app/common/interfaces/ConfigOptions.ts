import moment = require('moment');
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export interface ConfigOptions
{
    general: {
        siteName: string,
        siteUrl: string,
        production: string,
        environment: 'production' | 'development'
    },
    database: MysqlConnectionOptions,
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
                validateProduction: boolean
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
        catalog: {
            maxPurchaseStack: number
        }
        messenger: {
            maxFriends: number,
            maxFriendsHabboClub: number
        },
        tasks: {
            roller: {
                tick: number
            },
            unit: {
                tick: number
            }
        },
        pathfinder: {
            node: {
                cost: number
            },
            steps: {
                ignoreDoorTile: boolean,
                maxWalkingHeight: number,
                allowDiagonals: boolean,
                checkItemBelow: boolean
            }
        },
        rooms: {
            maxUnitsPerRoom: number,
            games: {
                freeze: {
                    geyserRandomMs: number
                }
            }
        },
        newUser: {
            homeRoom: number
        },
        unit: {
            idleTimerMs: number,
            handItemMs: number,
            lookTimerMs: number,
            roamTimerMs: number,
            idleKickMs: number
        },
        furni: {
            placement: {
                onUnit: boolean,
                maxZ: number
            },
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
        },
        express: {
            cors: boolean,
            allowedUrl: string
        }
    }
}