import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorCollapsedComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_COLLAPSED, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                this.packet.writeInt(46);
                this.packet.writeString('new_ads');
                this.packet.writeString('friend_finding');
                this.packet.writeString('staffpicks');
                this.packet.writeString('with_friends');
                this.packet.writeString('with_rights');
                this.packet.writeString('query');
                this.packet.writeString('recommended');
                this.packet.writeString('my_groups');
                this.packet.writeString('favorites');
                this.packet.writeString('history');
                this.packet.writeString('top_promotions');
                this.packet.writeString('campaign_target');
                this.packet.writeString('friends_rooms');
                this.packet.writeString('groups');
                this.packet.writeString('metadata');
                this.packet.writeString('history_freq');
                this.packet.writeString('highest_score');
                this.packet.writeString('competition');
                this.packet.writeString('category__Agencies');
                this.packet.writeString('category__Role Playing');
                this.packet.writeString('category__Global Chat & Discussi');
                this.packet.writeString('category__GLOBAL BUILDING AND DE');
                this.packet.writeString('category__global party');
                this.packet.writeString('category__global games');
                this.packet.writeString('category__global fansite');
                this.packet.writeString('category__global help');
                this.packet.writeString('category__Trading');
                this.packet.writeString('category__global personal space');
                this.packet.writeString('category__Habbo Life');
                this.packet.writeString('category__TRADING');
                this.packet.writeString('category__global official');
                this.packet.writeString('category__global trade');
                this.packet.writeString('category__global reviews');
                this.packet.writeString('category__global bc');
                this.packet.writeString('category__global personal space');
                this.packet.writeString('eventcategory__Hottest Events');
                this.packet.writeString('eventcategory__Parties & Music');
                this.packet.writeString('eventcategory__Role Play');
                this.packet.writeString('eventcategory__Help Desk');
                this.packet.writeString('eventcategory__Trading');
                this.packet.writeString('eventcategory__Games');
                this.packet.writeString('eventcategory__Debates & Discuss');
                this.packet.writeString('eventcategory__Grand Openings');
                this.packet.writeString('eventcategory__Friending');
                this.packet.writeString('eventcategory__Jobs');
                this.packet.writeString('eventcategory__Group Events');

                this.packet.prepare();

                return this.packet;
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}