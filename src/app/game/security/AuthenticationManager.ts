import { getManager } from 'typeorm';
import { PasswordHelper } from '../../common';
import { UserDao, UserEntity, UserInfoEntity, UserStatisticsEntity } from '../../database';
import { Nitro } from '../../Nitro';

export class AuthenticationManager
{
    constructor() {}

    public async checkCredentials(username: string, password: string): Promise<number>
    {
        if(!username || !password) return null;

        if(!Nitro.config.web.ticket.enabled) return null;
        
        const result = await UserDao.getLoginByUsername(username);

        if(!result) return null;
        
        if(!PasswordHelper.validatePassword(password, result.password)) return null;

        return result.id;
    }

    public async registerUser(username: string, email: string, password: string, ip: string): Promise<number>
    {
        if(!username || !email || !password) return null;
        
        await UserDao.validateUsername(username);
        await UserDao.validateEmail(email);

        const user = new UserEntity();

        user.username    = username;
        user.password    = PasswordHelper.encryptPassword(password);
        user.email       = email;
        user.ipRegister  = ip;

        await getManager().insert(UserEntity, user);

        const userInfo = new UserInfoEntity();

        userInfo.userId     = user.id;
        userInfo.homeRoom   = Nitro.config.game.newUser.homeRoom;

        await getManager().insert(UserInfoEntity, userInfo);
            
        const userStatistics = new UserStatisticsEntity();
            
        userStatistics.userId = user.id;

        await getManager().insert(UserStatisticsEntity, userStatistics);

        return user.id;
    }
}