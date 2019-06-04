import { Emulator } from '../../../../Emulator';
import { Group, Unit, UnitType } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitComposer extends Outgoing
{
    private _units: Unit[];

    constructor(...units: Unit[])
    {
        super(OutgoingHeader.UNIT);

        this._units = [ ...units ];
    }

    public compose(): OutgoingPacket
    {
        const totalUnits = this._units.length;

        if(!totalUnits) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalUnits);
        
        for(let i = 0; i < totalUnits; i++)
        {
            const unit = this._units[i];

            if(unit.type === UnitType.USER)
            {
                const favoriteGroupId = unit.user.details.favoriteGroupId;

                let group: Group = null;

                if(favoriteGroupId) group = Emulator.gameManager.groupManager.getActiveGroup(favoriteGroupId);

                this.packet
                    .writeInt(unit.user.id)
                    .writeString(unit.user.details.username)
                    .writeString(unit.user.details.motto)
                    .writeString(unit.user.details.figure)
                    .writeInt(unit.id)
                    .writeInt(unit.location.position.x)
                    .writeInt(unit.location.position.y)
                    .writeString(unit.location.position.z.toFixed(2))
                    .writeInt(unit.location.position.direction)
                    .writeInt(1)
                    .writeString(unit.user.details.gender.toUpperCase())
                    .writeInt(group ? favoriteGroupId : -1) // group id else -1
                    .writeInt(group ? favoriteGroupId : -1) // group id else -1
                    .writeString(group ? group.name : null) // guild name
                    .writeString(null)
                    .writeInt(unit.user.details.achievementScore)
                    .writeBoolean(true);
            }

            else if(unit.type === UnitType.BOT)
            {
                const ownerUsername = unit.room.getObjectOwnerName(unit.bot.userId);

                this.packet
                    .writeInt(unit.bot.id)
                    .writeString(unit.bot.name)
                    .writeString(unit.bot.motto)
                    .writeString(unit.bot.figure)
                    .writeInt(unit.id)
                    .writeInt(unit.location.position.x)
                    .writeInt(unit.location.position.y)
                    .writeString(unit.location.position.z.toString())
                    .writeInt(unit.location.position.direction)
                    .writeInt(4) // 2 pet 4 bot
                    .writeString(unit.bot.gender.toUpperCase())
                    .writeInt(unit.bot.userId) // owner id
                    .writeString(ownerUsername || '')
                    .writeInt(10)
                    .writeShort(0)
                    .writeShort(1)
                    .writeShort(2)
                    .writeShort(3)
                    .writeShort(4)
                    .writeShort(5)
                    .writeShort(6)
                    .writeShort(7)
                    .writeShort(8)
                    .writeShort(9);
            }

            else if(unit.type === UnitType.PET)
            {
                const ownerUsername = unit.room.getObjectOwnerName(unit.pet.userId);

                this.packet
                    .writeInt(unit.pet.id) // pet id
                    .writeString(unit.pet.name) // pet name
                    .writeString('')
                    .writeString(unit.pet.look)
                    .writeInt(unit.id) // unit id
                    .writeInt(unit.location.position.x) // x
                    .writeInt(unit.location.position.y) // y
                    .writeString(unit.location.position.z.toFixed(2)) // z
                    .writeInt(0, 2)
                    .writeInt(unit.pet.breed) // type
                    .writeInt(unit.pet.userId) // user id
                    .writeString(ownerUsername || '')
                    .writeInt(1) // rarity for monster
                    .writeBoolean(true) // has saddle true
                    .writeBoolean(false)
                    .writeBoolean(false) // monster can breed
                    .writeBoolean(false) // monter grown fully
                    .writeBoolean(false) // monster dead
                    .writeBoolean(false) // monster public breed
                    .writeInt(unit.pet.level) // pet level / monster growth stage
                    .writeString('');
            }
        }
        
        return this.packet.prepare();
    }
}