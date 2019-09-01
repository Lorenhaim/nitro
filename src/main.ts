import { Nitro } from './app';
import { Config } from './Config';

async function start()
{
    await Nitro.bootstrap(Config);

    await Nitro.start();
}

start();