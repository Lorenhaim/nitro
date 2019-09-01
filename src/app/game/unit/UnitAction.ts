export enum UnitAction
{
    NONE        = 0,
    WAVE        = 1,
    BLOW_KISS   = 2,
    LAUGH       = 3,
    UNKNOWN     = 4,
    IDLE        = 5,
    JUMP        = 6,
    THUMB_UP    = 7
}

export const VALID_ACTIONS = [ UnitAction.NONE, UnitAction.WAVE, UnitAction.BLOW_KISS, UnitAction.LAUGH, UnitAction.THUMB_UP ];