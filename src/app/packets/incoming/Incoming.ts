import { User } from '../../game';

import { IncomingPacket } from './IncomingPacket';

export abstract class Incoming
{
    public user: User;
    public packet: IncomingPacket;

    public abstract async process(): Promise<boolean>;
}