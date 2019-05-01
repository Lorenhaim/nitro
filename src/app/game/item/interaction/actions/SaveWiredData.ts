import { IncomingPacket } from '../../../../packets';
import { Item } from '../../Item';

export interface SaveWiredData
{
    saveWiredData(item: Item, packet: IncomingPacket): void;
}