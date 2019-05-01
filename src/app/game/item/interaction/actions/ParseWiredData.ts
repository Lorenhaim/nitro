import { OutgoingPacket } from '../../../../packets';
import { Item } from '../../Item';

export interface ParseWiredData
{
    parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket;
}