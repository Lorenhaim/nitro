import { GameType } from '../../../../room';
import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { InteractionDefault } from '../../InteractionDefault';

export class InteractionBattleBanzaiTimer extends InteractionDefault
{
    constructor()
    {
        super('bb_counter');
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const currentRoom = unit.room;

        if(!currentRoom) return;

        const gameInstance = currentRoom.gameManager.getGame(GameType.BATTLE_BANZAI);

        if(!gameInstance) return;

        setTimeout(async () => await gameInstance.start(), 300);
        
        super.onClick(unit, item, false);
    }
}