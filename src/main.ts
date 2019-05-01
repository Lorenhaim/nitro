import { Emulator } from './app';

async function start()
{
    console.log();
    console.log(` 888    888          888      888                     d8888 8888888b. 8888888 `);
    console.log(` 888    888          888      888                    d88888 888   Y88b  888   `);
    console.log(` 888    888          888      888                   d88P888 888    888  888   `);
    console.log(` 8888888888  8888b.  88888b.  88888b.   .d88b.     d88P 888 888   d88P  888   `);
    console.log(` 888    888     "88b 888 "88b 888 "88b d88""88b   d88P  888 8888888P"   888   `);
    console.log(` 888    888 .d888888 888  888 888  888 888  888  d88P   888 888         888   `);
    console.log(` 888    888 888  888 888 d88P 888 d88P Y88..88P d8888888888 888         888   `);
    console.log(` 888    888 "Y888888 88888P"  88888P"   "Y88P" d88P     888 888       8888888 `);
    console.log(` @habboapi by Billsonnn`);
    console.log();

    await Emulator.bootstrap();
}

start();