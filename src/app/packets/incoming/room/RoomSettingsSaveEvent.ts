import { Emulator } from '../../../Emulator';
import { RoomBanType, RoomChatMode, RoomChatSpeed, RoomChatWeight, RoomKickType, RoomMuteType, RoomSettingsSaveError, RoomState, RoomThickness, RoomTradeType } from '../../../game';
import { RoomSettingsChatComposer, RoomSettingsSaveComposer, RoomSettingsSaveErrorComposer, RoomSettingsUpdatedComposer, RoomThicknessComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomSettingsSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const room = await Emulator.gameManager.roomManager.getRoom(this.packet.readInt());

            if(!room) return;

            if(!room.securityManager.isOwner(this.client.user)) return;

            const name          = this.packet.readString();
            const description   = this.packet.readString();
            const state         = this.packet.readInt();
            const password      = this.packet.readString();
            const usersMax      = this.packet.readInt();
            const categoryId    = this.packet.readInt();

            const totalTags     = this.packet.readInt();

            const tags: string[] = [];

            if(totalTags) for(let i = 0; i < totalTags; i++) tags.push(this.packet.readString());

            const tradeType: RoomTradeType      = this.packet.readInt();
            const allowPets                     = this.packet.readBoolean();
            const allowPetsEat                  = this.packet.readBoolean();
            const allowWalkThrough              = this.packet.readBoolean();
            const hideWalls                     = this.packet.readBoolean();

            let thicknessWall: RoomThickness = this.packet.readInt();

            if(thicknessWall === 4294967294) thicknessWall = RoomThickness.THINNEST
            else if(thicknessWall === 4294967295) thicknessWall = RoomThickness.THIN;

            let thicknessFloor: RoomThickness = this.packet.readInt();

            if(thicknessFloor === 4294967294) thicknessFloor = RoomThickness.THINNEST
            else if(thicknessFloor === 4294967295) thicknessFloor = RoomThickness.THIN;

            const muteOption: RoomMuteType      = this.packet.readInt();
            const kickOption: RoomKickType      = this.packet.readInt();
            const banOption: RoomBanType        = this.packet.readInt();
            const chatMode: RoomChatMode        = this.packet.readInt();
            const chatWeight: RoomChatWeight    = this.packet.readInt();
            const chatSpeed: RoomChatSpeed      = this.packet.readInt();
            const chatDistance: number          = this.packet.readInt();
            const chatProtection                = this.packet.readInt();

            if(!name) return this.client.processOutgoing(new RoomSettingsSaveErrorComposer(room.id, RoomSettingsSaveError.INVALID_NAME, ''));

            if(state === RoomState.PASSWORD && !password) return this.client.processOutgoing(new RoomSettingsSaveErrorComposer(room.id, RoomSettingsSaveError.INVALID_PASSWORD, ''));

            // filter room name, error BAD_NAME

            // filter tags error TAGS_BAD_WORD or maybe RESTRICTED_TAGS

            room.details.updateSettings({
                name,
                description,
                state,
                password,
                usersMax,
                categoryId,
                totalTags,
                tags,
                tradeType,
                allowPets,
                allowPetsEat,
                allowWalkThrough,
                hideWalls,
                thicknessWall,
                thicknessFloor,
                muteOption,
                kickOption,
                banOption,
                chatMode,
                chatWeight,
                chatSpeed,
                chatDistance,
                chatProtection
            });

            room.unitManager.processOutgoing(new RoomThicknessComposer(room), new RoomSettingsChatComposer(room), new RoomSettingsUpdatedComposer(room));
            
            this.client.processOutgoing(new RoomSettingsSaveComposer(room));
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