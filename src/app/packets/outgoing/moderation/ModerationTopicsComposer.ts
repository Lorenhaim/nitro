import { Nitro } from '../../../Nitro';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ModerationTopicsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MODERATION_TOPICS);
    }

    public compose(): OutgoingPacket
    {
        const categories = Nitro.gameManager.moderationManager.categories;

        if(!categories) return this.packet.writeInt(0).prepare();

        const totalCategories = categories.length;

        if(!totalCategories) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalCategories);

        for(let i = 0; i < totalCategories; i++)
        {
            const category = categories[i];

            this.packet.writeString(category.name);

            const totalTopics = category.topics.length;

            if(totalTopics)
            {
                this.packet.writeInt(totalTopics);

                for(let j = 0; j < totalTopics; j++)
                {
                    const topic = category.topics[j];

                    this.packet
                        .writeString(topic.name)
                        .writeInt(topic.id)
                        .writeString('test'); // action???
                }
            }
            else this.packet.writeInt(0);
        }

        return this.packet.prepare();
    }
}