import { Emulator } from '../../../Emulator';
import { UnitType } from '../../../game';
import { DoorbellCloseComposer, RoomAccessDeniedComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomDoorbellEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const username  = this.packet.readString();
            const accepted  = this.packet.readBoolean();

            if(!this.client.user.unit.hasRights()) return;

            const user = Emulator.gameManager.userManager.getUserByUsername(username);

            if(!user) return;

            if(user.unit.roomLoading !== currentRoom) return;

            const totalUnits = currentRoom.unitManager.units.length;

            if(totalUnits)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const unit = currentRoom.unitManager.units[i];

                    if(!unit) continue;

                    if(unit.type !== UnitType.USER) continue;

                    if(!unit.hasRights()) continue;

                    unit.user.connections.processOutgoing(new DoorbellCloseComposer(username));
                }
            }

            if(!accepted) return user.connections.processOutgoing(new RoomAccessDeniedComposer());
            else return user.unit.enterRoomPartOne(currentRoom.id, null, true);
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