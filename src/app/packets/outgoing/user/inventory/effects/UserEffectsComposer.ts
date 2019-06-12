import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserEffectsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_EFFECTS);
    }

    public compose(): OutgoingPacket
    {
        const effects = this.client.user.inventory.effects.effects;

        if(!effects) return this.packet.writeInt(0).prepare();

        const totalEffects = effects.length;

        if(!totalEffects) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalEffects);

        for(let i = 0; i < totalEffects; i++)
        {
            const effect = effects[i];

            this.packet
                .writeInt(effect.effectId)
                .writeInt(0)
                .writeInt(effect.secondsAllowed)
                .writeInt(effect.secondsUsed)
                .writeInt(-1)
                .writeBoolean(false)
        }

        return this.packet.prepare();
    }
}