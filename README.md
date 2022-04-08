# RAGE Multiplayer roleplay gamemode
Roleplay gamemode for RAGE Multiplayer (GTA:V) using TypeScript. Based on [MarkCavalli's RAGE server start template](https://github.com/MarkCavalli/rage-server-start-template).

## Features
- MySQL database. The original server-side database module was replaced using TypeORM.
- Login and register system. Passwords are hashed using PBKDF2 with SHA-256. Different tables for users (`user` table) and characters (`player` table).
- [Kar's NativeUI](https://github.com/karscopsandrobbers/RAGEMP-NativeUI) support on the client-side.

## Commands
- `/weapon` - Spawn a weapon. See: [app/server/Player/WeaponHash.json](app/server/Player/WeaponHash.json)
- `/v` - Spawn a vehicle. See: [app/server/Vehicle/VehicleList.ts](app/server/Vehicle/VehicleList.ts)
- `/skin` - Set skin. See: [app/server/Player/PedHash.ts](app/server/Player/PedHash.ts)
- `/respawn` - Respawn after death.
- `/creator` - Customize character.
- `/clothes` - Customize clothes.
- Roleplay commands: `/me`, `/do`, `/l`, `/s`, `/w`.

## Install
- Set the SQL credentials in a `.env` file in the root folder. See: [.env.example](.env.example)
- Download and install dependencies: `npm install`
- Build: `npm run build`.
- Copy, move or symlink the `node_modules` folder and the folders inside `dist` into the root directory from the server.
- Run the server.

## See also
- [fedemahf/docker-ragemp](https://github.com/fedemahf/docker-ragemp) - Simple Docker container for RAGE Multiplayer
- [fedemahf/docker-ragemp-mysql](https://github.com/fedemahf/docker-ragemp-mysql) - Simple Docker container for RAGE Multiplayer and MySQL
