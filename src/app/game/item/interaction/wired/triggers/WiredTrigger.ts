import { IncomingPacket, OutgoingPacket, WiredTriggerConfigComposer } from '../../../../../packets';
import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { CanTrigger, OnClick, OnTriggered, ParseWiredData, SaveWiredData } from '../../actions';
import { InteractionWired } from '../../InteractionWired';
import { WiredTriggerType } from './WiredTriggerType';

export abstract class WiredTrigger extends InteractionWired implements OnClick, OnTriggered, CanTrigger, SaveWiredData, ParseWiredData
{
    private _triggerType: WiredTriggerType;

    constructor(name: string = null, triggerType: WiredTriggerType)
    {
        super(name || 'wired_trigger');

        this._triggerType = triggerType;
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        if(!unit.hasRights()) return;
        
        unit.user.connections.processOutgoing(new WiredTriggerConfigComposer(item));
    }

    public onTriggered(item: Item): void
    {
        if(!item) return;

        item.setExtraData('1');

        setTimeout(() => item.setExtraData('0'), 300);
    }

    public abstract canTrigger(item: Item, ...args: any[]): boolean;

    public abstract saveWiredData(item: Item, packet: IncomingPacket): void;

    public abstract parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket;

    public get triggerType(): WiredTriggerType
    {
        return this._triggerType;
    }
}