import { compareSync, hashSync } from 'bcryptjs';

export class PasswordHelper
{
    public static validatePassword(check: string, against: string): boolean
    {
        return check && against && compareSync(check, against);
    }

    public static encryptPassword(password: string): string
    {
        return password && hashSync(password);
    }
}