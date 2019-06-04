# nitro

For the latest updates join us on Discord: [https://discord.gg/4K7MEMz](https://discord.gg/4K7MEMz)

## Setup
run `npm i`

rename `ormconfig.js.new` to `ormconfig.js` and set your database details

rename `/src/app/Config.ts.new` to `/src/app/Config.ts` and modify the settings to your desired values

import `cleandb.sql` to your mysql database

the web / socket server requires https. you must set your certificate like so:

public key: `src/ssl/public.pem`
private key: `src/ssl/private.pem`

if you are not going to run the web server turn it off in the config

```
web: {
        enabled: false
}
```

if you do have the web server running, files in `/public` will be accessible on the web

### Development Server
make sure in `ormconfig.js` to comment out the production line like so:
```
entities: [ 'src/app/database/entities/*.ts' ], // development
//entities: [ 'dist/app/database/entities/*.js' ], // production
```
run `npm run dev` the server will automatically resetart when any changes are detected

### Production Server
make sure in `ormconfig.js` to comment out the development line like so:
```
//entities: [ 'src/app/database/entities/*.ts' ], // development
entities: [ 'dist/app/database/entities/*.js' ], // production
```
run `tsc --build`

run `npm start`