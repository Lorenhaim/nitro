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

            if(validatorType === 1)
            {
                await UserDao.validateUsername(this.packet.readString());

                this.client.processOutgoing(new ValidatorComposer(true));
            }
            else if(validatorType === 2)
            {
                await UserDao.validateEmail(this.packet.readString());

                this.client.processOutgoing(new ValidatorComposer(true));
            }
        }

        catch(err)
        {
            if(err && err.message && err.message === 'invalid_username' || err.message === 'invalid_email') this.client.processOutgoing(new ValidatorComposer(false));
            else this.error(err);
        }
    }
}