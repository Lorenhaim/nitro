import { getManager } from 'typeorm';
import { TimeHelper } from '../../common';
import { SecurityTicketEntity, UserEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class GenerateAccountsCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'generateaccounts');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;

        const amount = parseInt(parts[0]);

        if(!amount) return;

        const userEntities: UserEntity[] = [];

        for(let i = 0; i < amount; i++)
        {
            const userId = await Emulator.gameManager.securityManager.authenticationManager.registerUser(`username${ i }`, `email${ i }@email.com`, `password${ i }`, null, '0.0.0.0');

            if(userId)
            {
                const ticketEntity = new SecurityTicketEntity();

                ticketEntity.userId             = userId;
                ticketEntity.ticket             = `sso${ i }`;
                ticketEntity.ticketType         = 'game';
                ticketEntity.ipAddress          = '0.0.0.0';
                ticketEntity.timestampExpires   = TimeHelper.add(TimeHelper.now, Emulator.config.game.ticket.maxLength, Emulator.config.game.ticket.maxLengthType);
                ticketEntity.isLocked           = '1';

                await getManager().save(ticketEntity);
            }
        }
    }
}