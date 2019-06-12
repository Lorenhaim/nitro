import { ConfigOptions, Nitro } from './app';
import { Config } from './Config';

async function start(config: ConfigOptions)
{
    await Nitro.bootstrap(config);
}

start(Config);