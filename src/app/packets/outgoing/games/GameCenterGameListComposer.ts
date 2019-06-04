import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GameCenterGameListComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.GAME_CENTER_GAME_LIST);
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(2)
            .writeInt(1)
            .writeString('snowwar')
            .writeString('93d4f3')
            .writeString('')
            .writeString('http://habboo-a.akamaihd.net/gamecenter/Sulake/slotcar/20130214010101/')
            .writeString('')
            .writeInt(3)
            .writeString('basejump')
            .writeString('68bbd2')
            .writeString('')
            .writeString('http://habboo-a.akamaihd.net/gamecenter/Sulake/slotcar/20130214010101/')
            .writeString('')
            .writeInt(4)
            .writeString('slotcar')
            .writeString('4a95df')
            .writeString('')
            .writeString('http://habboo-a.akamaihd.net/gamecenter/Sulake/slotcar/20130214010101/')
            .writeString('')
            .prepare();
    }
}