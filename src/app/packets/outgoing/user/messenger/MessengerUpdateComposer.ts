import { Logger } from '../../../../common';
import { User, MessengerUpdate } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerUpdateComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.MESSENGER_UPDATE, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.messenger() && this.user.messenger().isLoaded)
            {
                const totalCategories = this.user.messenger().categories.length;

                if(totalCategories)
                {
                    this.packet.writeInt(totalCategories);

                    for(let i = 0; i < totalCategories; i++)
                    {
                        const category = this.user.messenger().categories[i];

                        this.packet.writeInt(category.id);
                        this.packet.writeString(category.name);
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                }

                const totalUpdates = this.user.messenger().pendingUpdates.length;

                if(totalUpdates)
                {
                    this.packet.writeInt(totalUpdates);

                    for(let i = 0; i < totalUpdates; i++)
                    {
                        const update = this.user.messenger().pendingUpdates[i];

                        if(update.type === 'add')
                        {
                            this.packet.writeInt(1);
                            this.packet.writeInt(update.friend.userId); // if group 0
                            this.packet.writeString(update.friend.username); // group name
                            this.packet.writeInt(update.friend.gender === 'M' ? 0 : 1); //group 0
                            this.packet.writeBoolean(update.friend.online);
                            this.packet.writeBoolean(false); // inroom / following enabled
                            this.packet.writeString(update.friend.figure); // group badge
                            this.packet.writeInt(update.friend.categoryId); // category id
                            this.packet.writeString(update.friend.motto);
                            this.packet.writeString('');
                            this.packet.writeString('');
                            this.packet.writeBoolean(false); // allow offline messaging
                            this.packet.writeBoolean(false);
                            this.packet.writeBoolean(false); // has pocket habbo
                            this.packet.writeShort(update.friend.relation);
                        }
                        else if(update.type === 'update')
                        {
                            this.packet.writeInt(0);
                            this.packet.writeInt(update.friend.userId); // if group 0
                            this.packet.writeString(update.friend.username); // group name
                            this.packet.writeInt(update.friend.gender === 'M' ? 0 : 1); //group 0
                            this.packet.writeBoolean(update.friend.online);
                            this.packet.writeBoolean(false); // inroom / following enabled
                            this.packet.writeString(update.friend.figure); // group badge
                            this.packet.writeInt(update.friend.categoryId); // category id
                            this.packet.writeString(update.friend.motto);
                            this.packet.writeString('');
                            this.packet.writeString('');
                            this.packet.writeBoolean(false); // allow offline messaging
                            this.packet.writeBoolean(false);
                            this.packet.writeBoolean(false); // has pocket habbo
                            this.packet.writeShort(update.friend.relation);
                        }
                        else if(update.type === 'remove')
                        {
                            this.packet.writeInt(-1);
                            this.packet.writeInt(update.friend.userId);
                        }
                    }
                    
                    this.user.messenger().clearPendingUpdates();
                }
                else
                {
                    this.packet.writeInt(0);
                }

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