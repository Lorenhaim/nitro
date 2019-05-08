export const enum UnitEmotion
{
    NORMAL      = 0,
    HAPPY       = 1,
    MAD         = 2,
    SUPRISED    = 3,
    SAD         = 4
}

export function determineEmotion(message: string): UnitEmotion
{
    if(!message) return UnitEmotion.NORMAL;

    if(message.indexOf(':)') > -1 || message.indexOf(':-)') > -1 || message.indexOf(':]') > -1) return UnitEmotion.HAPPY;

    if(message.indexOf(':@') > -1 || message.indexOf('>:(') > -1) return UnitEmotion.MAD;

    if(message.indexOf(':o') > -1 || message.indexOf(':O') > -1 || message.indexOf(':0') > -1 || message.indexOf('o.O') > -1 || message.indexOf('O.O') > -1) return UnitEmotion.SUPRISED;

    if(message.indexOf(':(') > -1 || message.indexOf(':-(') > -1 || message.indexOf(':[') > -1) return UnitEmotion.SAD;

    return UnitEmotion.NORMAL;
}