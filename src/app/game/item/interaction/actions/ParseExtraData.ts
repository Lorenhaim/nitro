import { OutgoingPacket } from '../../../../packets';
import { Item } from '../../Item';

export interface ParseExtraData
{
    parseExtraData(item: Item, packet: OutgoingPacket): OutgoingPacket;
}