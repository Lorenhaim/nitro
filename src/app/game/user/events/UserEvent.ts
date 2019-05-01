import { User } from '../User';

export abstract class UserEvent
{
    public user: User;

    public abstract async runEvent(): Promise<void>;
}