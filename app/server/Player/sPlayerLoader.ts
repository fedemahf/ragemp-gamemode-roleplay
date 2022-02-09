/// <reference path="../index.d.ts" />

// import DB from '../Options/sDB';
// import Logger from '../Options/sLogger';
import PedHash = require("./PedHash");

export default class PlayerLoader {
    constructor(player: PlayerMp) {
        this.loadMethods(player);
    }

    loadMethods(player: PlayerMp) {
        player.updateName = function() {
            this.name = `${this.firstName} ${this.lastName}`;
        }

        player.isDriver = function() {
            if (!this.vehicle || this.seat !== -1) return false;
            return true;
        }

        player.teleport = function(coord: EntityCoord) {
            this.position = coord.pos;
            this.heading = coord.rot;
            this.dimension = coord.dim;
        }

        player.setSkin = function(skinName: string): number | undefined {
            let skinId: number;
            skinName = skinName.trim().toLowerCase();

            if (PedHash.list[skinName]) {
                skinId = PedHash.list[skinName];
            } else {
                let tmp: number = parseInt(skinName, 10);

                if (!isNaN(tmp) && tmp >= 0 && tmp < PedHash.hashes.length) {
                    skinId = PedHash.hashes[tmp];
                }
            }

            if (skinId) {
                player.model = skinId;
            }

            return skinId;
        }
    }
}
