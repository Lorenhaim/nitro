import { getManager } from 'typeorm';

import { ServerConfigEntity } from './entities';
import { Logger } from './Logger';

export class Config
{
    private _config: { key: string, value: string }[];

    constructor()
    {
        this._config = [];
    }

    public getConfig()
    {
        return this._config;
    }

    public async loadConfig(): Promise<boolean>
    {
        this._config = [];
        
        const results = await getManager().find(ServerConfigEntity);

        if(!results)
        {
            Logger.writeWarning(`Config -> No items loaded`);

            return Promise.resolve(true);
        }

        for(const result of results) this.addKey(result.key, result.value);

        Logger.writeLine(`Config -> Loaded ${ this._config.length } items`);

        return Promise.resolve(true);
    }

    public getString(key: string, d: string): string
    {
        let result = d;

        for(const item of this._config)
        {
            if(item.key === key)
            {
                result = item.value;

                break;
            }
        }

        return result;
    }

    public getNumber(key: string, d: number): number
    {
        return parseInt(this.getString(key, d.toString()));
    }

    public getBoolean(key: string, d: boolean): boolean
    {
        return this.getString(key, d ? '1' : '0') === '1';
    }

    public addKey(key: string, value: string): boolean
    {
        let result = false;

        for(const [index, item] of this._config.entries())
        {
            if(item.key === key)
            {
                result = true;

                this._config.splice(index, 1);

                this._config.push({ key, value });

                break;
            }
        }

        if(!result) this._config.push({ key, value });
        
        return true;
    }

    public removeKey(key: string): boolean
    {
        for(const [index, item] of this._config.entries())
        {
            if(item.key === key)
            {
                this._config.splice(index, 1);

                break;
            }
        }

        return true;
    }
}