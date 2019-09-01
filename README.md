# nitro

For the latest updates join us on Discord: [https://discord.gg/4K7MEMz](https://discord.gg/4K7MEMz)

## Setup
run `npm i`

rename `/src/Config.ts.new` to `/src/Config.ts` and modify the settings to your desired values

import `cleandb.sql` to your mysql database

if you are not going to run the web server turn it off in the config

```
web: {
        enabled: false
}
```

run `npm run dev` the server will automatically restart when any changes are detected