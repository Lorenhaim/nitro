import { Config, ConfigOptions, Nitro } from './app';

async function start(config: ConfigOptions)
{
    await Nitro.bootstrap(config);
}

start(Config);