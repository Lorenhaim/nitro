import { Incoming } from '../../../Incoming';

export class BadgesCurrentUpdateEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const badges: { slotNumber: 1 | 2 | 3 | 4 | 5, badgeCode: string }[] = [];

            for(let i = 0; i < 5; i++)
            {
                const slotNumber: any   = this.packet.readInt();
                const badgeCode         = this.packet.readString();

                if(slotNumber && badgeCode) badges.push({ slotNumber, badgeCode });
            }

            if(badges.length) this.client.user.inventory.badges.setCurrentBadges(...badges);
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}