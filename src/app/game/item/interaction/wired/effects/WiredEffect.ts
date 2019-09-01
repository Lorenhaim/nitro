import { IncomingPacket, OutgoingPacket, WiredEffectConfigComposer } from '../../../../../packets';
import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { OnClick, OnTriggered, ParseWiredData, SaveWiredData } from '../../actions';
import { InteractionWired } from '../../InteractionWired';
import { WiredEffectType } from './WiredEffectType';

export abstract class WiredEffect extends InteractionWired implements OnClick, OnTriggered, SaveWiredData, ParseWiredData
{
    private _triggerType: WiredEffectType;

    constructor(name: string = null, triggerType: WiredEffectType)
    {
        super(name || 'wired_trigger');

        this._triggerType = triggerType;
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        if(!unit.hasRights()) return;
        
        unit.user.connections.processOutgoing(new WiredEffectConfigComposer(item));

        super.onClick(unit, item, false);
    }

    public onTriggered(item: Item, ...args: any[]): void
    {
        if(!item) return;

        item.setExtraData('1');

        setTimeout(() => item.setExtraData('0'), 300);
    }

    public abstract saveWiredData(item: Item, packet: IncomingPacket): void;

    public abstract parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket;

    public get triggerType(): WiredEffectType
    {
        return this._triggerType;
    }
}