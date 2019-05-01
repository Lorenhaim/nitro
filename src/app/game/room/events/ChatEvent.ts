import { TimeHelper } from '../../../common';
import { Emulator } from '../../../Emulator';
import { UnitActionComposer, UnitChatComposer, UnitChatShoutComposer, UnitChatWhisperComposer } from '../../../packets';
import { WiredTriggerSaysSomething } from '../../item';
import { Unit, UnitAction, UnitEmotion, UnitType } from '../../unit';
import { ChatBubble, ChatType } from '../interfaces';
import { RoomEvent } from './RoomEvent';

export class ChatEvent extends RoomEvent
{
    private _unit: Unit;
    private _message: string;
    private _type: ChatType;
    private _username: string;

    constructor(unit: Unit, message: string, type: ChatType, username: string = null)
    {
        super();

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        if(!message) throw new Error('invalid_message');

        this._unit      = unit;
        this._message   = message;
        this._type      = type || ChatType.NORMAL;

        if(this._type === ChatType.WHISPER && !username) throw new Error('invalid_whisper');

        this._username = username;
    }

    public async runEvent(): Promise<void>
    {
        if(this._unit.type === UnitType.USER)
        {
            if(this._message.charAt(0) === ':')
            {
                const parts = this._message.substr(1).split(' ');

                if(parts.length > 0)
                {
                    const command = Emulator.gameManager.commandManager.getCommand(parts[0]);

                    if(command !== null)
                    {
                        parts.splice(0, 1);

                        await command.process(this._unit.user, parts);

                        return;
                    }
                }
            }
            
            if(this._unit.lastChat < TimeHelper.currentTimestamp - 250)
            {
                this._unit.timer.resetIdleTimer();

                let emotion: UnitEmotion = UnitEmotion.NORMAL;

                if(this._message.includes(':)') || this._message.includes(':-)') || this._message.includes(':]')) emotion = UnitEmotion.HAPPY;
                else if(this._message.includes(':@') || this._message.includes('>:(')) emotion = UnitEmotion.MAD;
                else if(this._message.includes(':o') || this._message.includes(':O') || this._message.includes(':0') || this._message.includes('O.o') || this._message.includes('o.O') || this._message.includes('O.O')) emotion = UnitEmotion.SUPRISED;
                else if(this._message.includes(':o') || this._message.includes(':O') || this._message.includes(':0') || this._message.includes('O.o') || this._message.includes(':(') || this._message.includes(':-(') || this._message.includes(':[')) emotion = UnitEmotion.SAD;
                
                if(this._type === ChatType.WHISPER)
                {
                    const activeUser = Emulator.gameManager.userManager.getUserByUsername(this._username);

                    if(activeUser)
                    {
                        if(activeUser === this._unit.user) return;

                        if(activeUser.unit && activeUser.unit.room && activeUser.unit.room.id === this.room.id)
                        {
                            if(this._message.endsWith('o/')) activeUser.connections.processOutgoing(new UnitActionComposer(this._unit, UnitAction.WAVE));

                            activeUser.connections.processOutgoing(new UnitChatWhisperComposer({
                                unit: this._unit,
                                message: this._message,
                                emotion,
                                bubble: ChatBubble.STAFF
                            }));

                            this._unit.user.connections.processOutgoing(new UnitChatWhisperComposer({
                                unit: this._unit,
                                message: this._message,
                                emotion,
                                bubble: ChatBubble.STAFF
                            }));
                        }
                    }
                }
                else
                {
                    const totalUnits = this.room.unitManager.units.length;

                    if(totalUnits)
                    {
                        for(let i = 0; i < totalUnits; i++)
                        {
                            const activeUnit = this.room.unitManager.units[i];

                            if(!activeUnit) continue;

                            if(activeUnit.type !== UnitType.USER) continue;

                            // dont send to ignored users, but admins see it anyway

                            if(activeUnit.location.position.getDistanceAround(this._unit.location.position) <= this.room.details.chatDistance || this._type === ChatType.SHOUT)
                            {
                                if(this._message.endsWith('o/'))
                                {
                                    activeUnit.user.connections.processOutgoing(new UnitActionComposer(this._unit, UnitAction.WAVE));

                                    this._message.slice(0, -2);
                                }

                                if(activeUnit !== this._unit) activeUnit.location.lookAtPosition(this._unit.location.position, true);

                                const chat = {
                                    unit: this._unit,
                                    message: this._message,
                                    emotion,
                                    bubble: ChatBubble.STAFF
                                };

                                if(this._type === ChatType.NORMAL) activeUnit.user.connections.processOutgoing(new UnitChatComposer(chat));
                                else if(this._type === ChatType.SHOUT) activeUnit.user.connections.processOutgoing(new UnitChatShoutComposer(chat));
                            }
                        }
                    }

                    await this.room.wiredManager.processTrigger(WiredTriggerSaysSomething, this._unit.user, this._message);
                }

                this._unit.lastChat = TimeHelper.currentTimestamp;
            }
        }
    }
}