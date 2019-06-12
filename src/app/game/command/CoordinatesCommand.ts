import { TimeHelper } from '../../common';
import { GenericAlertComposer } from '../../packets';
import { DirectionNames } from '../pathfinder';
import { RoomTileState } from '../room';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class CoordinatesCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'coords', 'pos', 'xyz');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;
        
        const currentPosition   = user.unit.location.position;
        const currentTile       = user.unit.location.getCurrentTile();
        const currentItem       = user.unit.location.getCurrentItem();
        
        let message = '';
        
        if(currentPosition)
        {
            message += 
                `<b>Current Position</b>\r` +
                `  x => ${ currentPosition.x }\r` +
                `  y => ${ currentPosition.y }\r` +
                `  z => ${ currentPosition.z }\r` +
                `  direction => [ ${ currentPosition.direction } ] ${ DirectionNames[currentPosition.direction] }\r` +
                `  headDirection => [ ${ currentPosition.headDirection } ] ${ DirectionNames[currentPosition.headDirection] }\r\r`;
        }
        
        if(currentTile)
        {
            message +=
                `<b>Current Tile</b>\r` +
                `  state => ${ currentTile.state === RoomTileState.OPEN ? 'open' : 'closed' }\r` +
                `  isDoor => ${ currentTile.isDoor }\r` +
                `  canStack => ${ currentTile.canStack }\r` +
                `  canWalk => ${ currentTile.canWalk }\r` +
                `  tileHeight => ${ currentTile.tileHeight }\r` +
                `  walkingHeight => ${ currentTile.walkingHeight }\r\r`;
        }
        
        if(currentItem)
        {
            message +=
                `<b>Current Item</b>\r` +
                `  publicName => ${ currentItem.baseItem.publicName }\r` +
                `  productName => ${ currentItem.baseItem.productName }\r` +
                `  spriteId => ${ currentItem.baseItem.spriteId }\r` +
                `  width => ${ currentItem.baseItem.width }\r` +
                `  length => ${ currentItem.baseItem.length }\r` +
                `  stackHeight => ${ currentItem.baseItem.stackHeight }\r` +
                `  interaction => ${ currentItem.baseItem.interaction.constructor.name }\r` +
                `  canWalk => ${ currentItem.baseItem.canWalk }\r` +
                `  canSit => ${ currentItem.baseItem.canSit }\r` +
                `  canLay => ${ currentItem.baseItem.canLay }\r` +
                `  itemCreated => ${ TimeHelper.formatDate(currentItem.timestampCreated, 'lll') }\r\r`;
        }
        
        if(message) user.connections.processOutgoing(new GenericAlertComposer(message));
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Gives information about your current location';
    }
}