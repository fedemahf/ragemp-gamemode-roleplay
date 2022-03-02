/// <reference path="../index.d.ts" />

import DB from '../Options/sDB';
import Logger from '../Options/sLogger';
import PlayerLoader from './sPlayerLoader';
import Browser from '../Options/sBrowser';
import Camera from '../Options/sCamera';


class PlayerSingletone {
    startCoord: EntityCoord;

    constructor() {
        this.startCoord = {
            pos: new mp.Vector3(-164.0, 6426.0, 32.0),
            rot: 120,
            dim: 0,
        }
    }

    async createUser(player: PlayerMp, email: string, firstName: string, lastName: string, password: string, salt: string): Promise<boolean> {
        const pos: string = JSON.stringify(this.startCoord);
        // const socialClub: string = player.socialClub;
        const result1: any = await DB.query(`INSERT INTO user (name, email, password, salt) VALUES ('', ${DB.escape(email)}, ${DB.escape(password)}, ${DB.escape(salt)})`);

        if (result1.insertId) {
            const user_id: number = result1.insertId;
            const result2: any = await DB.query(`INSERT INTO player (user_id, firstName, lastName, x, y, z, rz, dimension) VALUES (${DB.escape(user_id)}, ${DB.escape(firstName)}, ${DB.escape(lastName)}, '${this.startCoord.pos.x}', '${this.startCoord.pos.y}', '${this.startCoord.pos.z}', '${this.startCoord.rot}', '${this.startCoord.dim}')`);

            if (result2.insertId) {
                Logger.debug(`New Account: ${email} | ${firstName} ${lastName} | ${player.socialClub}`);
                return true;
            }
        }

        return false;
    }

    async loadAccount(player: PlayerMp, user_id: number) {
        const d: any = await DB.query(`SELECT * from player WHERE user_id = '${user_id}' LIMIT 1`);

        if (!d[0]) {
            Browser.showNotification(player, `Character not found!`, `red`, 4, `Error`, `error.svg`);
            player.admin = undefined;
        } else {
            let coord: EntityCoord = {
                pos: new mp.Vector3(d[0].x, d[0].y, d[0].z),
                rot: d[0].rz,
                dim: d[0].dimension
            };

            player.user_id = user_id;
            player.id_sql = d[0].id;
            player.firstName = d[0].firstName;
            player.lastName = d[0].lastName;

            Browser.setLoadingScreenState(player, true);
            Browser.setUrl(player, '/', false);
            Camera.resetCamera(player);

            new PlayerLoader(player);
            player.updateName();

            setTimeout(() => {
                // player.teleport(JSON.parse(d[0].position));
                player.teleport(coord);
            }, 500);
            setTimeout(() => {
                Browser.setLoadingScreenState(player, false);
            }, 1000); 

            player.loggedIn = true;
            player.call("cMisc-CallServerEvent", ["CharCreator_LoadCharacter"]);
        }
    }
}

export default new PlayerSingletone();
