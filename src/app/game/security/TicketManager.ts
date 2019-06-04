import { randomBytes } from 'crypto';
import { FindConditions, getManager, Not } from 'typeorm';
import { TimeHelper } from '../../common';
import { SecurityTicketEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { TicketType } from './TicketType';

export class TicketManager
{
    constructor() {}

    public async checkWebTicket(ticket: string, ip: string): Promise<number>
    {
        if(Emulator.config.web.ticket.enabled)
        {
            const whereOptions: FindConditions<SecurityTicketEntity> = {
                ticket: ticket,
                ticketType: TicketType.WEB
            };

            if(Emulator.config.web.ticket.validateIp) whereOptions.ipAddress = ip;

            const result = await getManager().findOne(SecurityTicketEntity, {
                where: whereOptions
            });
            
            if(result && result.userId)
            {
                if(result.isLocked === '0')
                {
                    if(result.timestampExpires < TimeHelper.now)
                    {
                        await getManager().delete(SecurityTicketEntity, result.id);

                        return null;
                    }
                }

                return result.userId;
            }
        }
        
        return null;
    }

    public async checkGameTicket(ticket: string, ip: string): Promise<number>
    {
        if(Emulator.config.game.ticket.enabled)
        {
            const whereOptions: FindConditions<SecurityTicketEntity> = {
                ticket: ticket,
                ticketType: TicketType.GAME
            };

            if(Emulator.config.game.ticket.validateIp) whereOptions.ipAddress = ip;

            const result = await getManager().findOne(SecurityTicketEntity, {
                where: whereOptions
            });
            
            if(result && result.userId)
            {
                if(result.isLocked === '0')
                {
                    await getManager().delete(SecurityTicketEntity, result.id);
                    
                    if(result.timestampExpires < TimeHelper.now) return null;
                }

                return result.userId;
            }
        }

        return null;
    }

    public async generateWebTicket(userId: number, ip: string): Promise<string>
    {
        if(Emulator.config.web.ticket.enabled)
        {
            const ticket = randomBytes(16).toString('hex');

            if(userId && ip && ticket)
            {
                const ticketEntity = new SecurityTicketEntity();

                ticketEntity.userId             = userId;
                ticketEntity.ticket             = ticket;
                ticketEntity.ticketType         = TicketType.WEB;
                ticketEntity.ipAddress          = ip;
                ticketEntity.timestampExpires   = TimeHelper.add(TimeHelper.now, Emulator.config.web.ticket.maxLength, Emulator.config.web.ticket.maxLengthType);

                await getManager().save(ticketEntity);

                await getManager().delete(SecurityTicketEntity, {
                    id: Not(ticketEntity.id),
                    userId: userId,
                    ticketType: 'web'
                });

                return ticket;
            }
        }

        return null;
    }

    public async generateGameTicket(userId: number, ip: string): Promise<string>
    {
        if(Emulator.config.game.ticket.enabled)
        {
            const ticket = randomBytes(16).toString('hex');

            if(userId && ip && ticket)
            {
                const ticketEntity = new SecurityTicketEntity();

                ticketEntity.userId             = userId;
                ticketEntity.ticket             = ticket;
                ticketEntity.ticketType         = TicketType.GAME;
                ticketEntity.ipAddress          = ip;
                ticketEntity.timestampExpires   = TimeHelper.add(TimeHelper.now, Emulator.config.game.ticket.maxLength, Emulator.config.game.ticket.maxLengthType);

                await getManager().save(ticketEntity);

                await getManager().delete(SecurityTicketEntity, {
                    id: Not(ticketEntity.id),
                    userId: userId,
                    ticketType: 'game'
                });

                return ticket;
            }
        }

        return null;
    }
}