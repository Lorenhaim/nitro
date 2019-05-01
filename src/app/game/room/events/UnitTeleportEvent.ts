import { ItemDao } from '../../../database';
import { Emulator } from '../../../Emulator';
import { Item } from '../../item';
import { Unit, UnitTeleporting } from '../../unit';
import { RoomEvent } from './RoomEvent';

export class UnitTeleportEvent extends RoomEvent
{
    private _unit: Unit;
    private _teleport: Item;

    constructor(unit: Unit, teleport: Item)
    {
        super();

        if(!(unit instanceof Unit) || !(teleport instanceof Item)) throw new Error('invalid_teleport');

        this._unit      = unit;
        this._teleport  = teleport;
    }

    public async runEvent(): Promise<void>
    {
        if(this._unit.location.position.compare(this._teleport.position))
        {
            this._unit.canLocate = false;

            const pairingTeleport = await ItemDao.getTeleportPairing(this._teleport.id);

            if(pairingTeleport)
            {
                let foundTeleport: Item     = null;
                let pairRoomId: number      = 0;
                let pairTeleportId: number  = 0;

                if(pairingTeleport.teleportIdOne && pairingTeleport.teleportIdTwo)
                {
                    if(pairingTeleport.teleportIdOne === this._teleport.id)
                    {
                        if(pairingTeleport.teleportTwo)
                        {
                            pairRoomId      = pairingTeleport.teleportTwo.roomId;
                            pairTeleportId  = pairingTeleport.teleportIdTwo;
                        }
                    }

                    else if(pairingTeleport.teleportIdTwo === this._teleport.id)
                    {
                        if(pairingTeleport.teleportOne)
                        {
                            pairRoomId      = pairingTeleport.teleportOne.roomId;
                            pairTeleportId  = pairingTeleport.teleportIdOne;
                        }
                    }
                }

                if(pairRoomId && pairTeleportId)
                {
                    const room = await Emulator.gameManager.roomManager.getRoom(pairRoomId);

                    if(room)
                    {
                        const roomAdd = Emulator.gameManager.roomManager.addRoom(room);

                        await roomAdd.init();

                        foundTeleport = roomAdd.itemManager.getItem(pairTeleportId);

                        roomAdd.tryDispose();
                    }
                }

                if(foundTeleport)
                {
                    this._unit.location.teleporting = new UnitTeleporting(this._unit, false, this._teleport, foundTeleport);
                }
                else
                {
                    this._unit.location.teleporting = new UnitTeleporting(this._unit, true, this._teleport, null);
                }
            }
            else
            {
                this._unit.location.teleporting = new UnitTeleporting(this._unit, true, this._teleport, null);
            }
        }
    }
}