import { get as HttpsGet } from 'https';
import { getManager } from 'typeorm';
import { PasswordHelper } from '../../common';
import { UserDao, UserEntity, UserInfoEntity, UserStatisticsEntity } from '../../database';
import { Nitro } from '../../Nitro';

export class AuthenticationManager
{
    constructor() {}

    public async checkCredentials(username: string, password: string): Promise<number>
    {
        if(username && password)
        {
            if(Nitro.config.web.ticket.enabled)
            {
                const result = await UserDao.getLoginByUsername(username);
        
                if(result && PasswordHelper.validatePassword(password, result.password)) return result.id;
            }
        }

        return null;
    }

    public validateCaptcha(response: string, ip: string): boolean
    {
        if(Nitro.config.captcha.enabled)
        {
            const secretKey = Nitro.config.captcha.secretKey;

            if(secretKey)
            {
                const request = HttpsGet(`https://www.google.com/recaptcha/api/siteverify?secret=${ secretKey }&response=${ response }&remoteIp=${ ip }`, response =>
                {
                    let chunks = '';

                    response.on('data', chunk => chunks += chunk);

                    response.on('end', () =>
                    {
                        let chunkParsed = JSON.parse(chunks);

                        return chunkParsed && chunkParsed.success;
                    });
                });

                request.on('error', err =>
                {
                    return false;
                });
            }
        }

        return true;
    }

    // public validateCaptcha(response: string, ip: string): Promise<void>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         if(Emulator.config.getBoolean('captcha.enabled', false))
    //         {
    //             const secretKey = Emulator.config.getString('captcha.secretKey', null);

    //             if(secretKey)
    //             {
    //                 const request = HttpsGet(`https://www.google.com/recaptcha/api/siteverify?secret=${ secretKey }&response=${ response }&remoteIp=${ ip }`, response =>
    //                 {
    //                     let chunks = '';

    //                     response.on('data', chunk => chunks += chunk);

    //                     response.on('end', () =>
    //                     {
    //                         let chunkParsed = JSON.parse(chunks);

    //                         chunkParsed && chunkParsed.success ? resolve() : reject(new Error('invalid_captcha'));
    //                     });
    //                 });

    //                 request.on('error', err => reject(new Error('invalid_captcha')));
    //             }
    //         }
    //         else
    //         {
    //             resolve();
    //         }
    //     });
    // }

    public async registerUser(username: string, email: string, password: string, captcha: string, ip: string): Promise<number>
    {
        if(username && email && password)
        {
            if(Nitro.config.captcha.enabled) await this.validateCaptcha(captcha, ip);

            await UserDao.validateUsername(username);

            await UserDao.validateEmail(email);

            const user = new UserEntity();

            user.username    = username;
            user.password    = PasswordHelper.encryptPassword(password);
            user.email       = email;
            user.ipRegister  = ip;

            await getManager().insert(UserEntity, user);

            const userInfo = new UserInfoEntity();

            userInfo.userId = user.id;

            await getManager().insert(UserInfoEntity, userInfo);
            
            const userStatistics = new UserStatisticsEntity();
            
            userStatistics.userId = user.id;

            await getManager().insert(UserStatisticsEntity, userStatistics);

            return Promise.resolve(user.id);
        }
    }
}