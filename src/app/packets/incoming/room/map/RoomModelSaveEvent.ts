import { getManager } from 'typeorm';
import { NumberHelper } from '../../../../common';
import { RoomModelEntity } from '../../../../database';
import { Emulator } from '../../../../Emulator';
import { RoomModel } from '../../../../game';
import { UserFowardRoomComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RoomModelSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(!this.client.user.unit.isOwner()) return;

            const rawModel = this.packet.readString().replace(/\r\n|\r|\n/g, '\r');

            if(!rawModel) return;

            const entity = new RoomModelEntity();

            entity.name             = `model_custom_${ currentRoom.id }_${ NumberHelper.generateNumber() }`;
            entity.doorX            = this.packet.readInt();
            entity.doorY            = this.packet.readInt();
            entity.doorDirection    = <any> this.packet.readInt().toString();
            entity.model            = rawModel;
            entity.enabled          = '1';
            entity.custom           = '1';

            const model = new RoomModel(entity);

            if(!model.didGenerate) return;

            if(!model.validateModel(currentRoom)) return;

            await getManager().save(entity);

            if(!Emulator.gameManager.roomManager.hasModel(entity.id))
            {
                Emulator.gameManager.roomManager.models.push(model);
            }

            currentRoom.details.setModel(model);

            currentRoom.unitManager.processOutgoing(new UserFowardRoomComposer(currentRoom.id));
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