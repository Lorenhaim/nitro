import { UserDao } from '../../../database';
import { ValidatorComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class ValidatorEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const validatorType = this.packet.readInt();

            if(validatorType === 1) return this.client.processOutgoing(new ValidatorComposer(await UserDao.validateUsername(this.packet.readString())));
            else if(validatorType === 2) return this.client.processOutgoing(new ValidatorComposer(await UserDao.validateEmail(this.packet.readString())));
        }

        catch(err)
        {
            if(err && err.message && err.message === 'invalid_username' || err.message === 'invalid_email') this.client.processOutgoing(new ValidatorComposer(false));
            else this.error(err);
        }
    }
}