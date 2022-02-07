/// <reference path="../index.d.ts" />

import Logger from '../Options/sLogger';
import vehicleList from './VehicleList';
import ChatMisc from './../Chat/ChatMisc';

class Vehicle {
    constructor() {
        mp.events.addCommand({
            'v': (player: PlayerMp, fullText: string) => {
                if (ChatMisc.notLoggedError(player)) {
                    return;
                }

                let vehicleName: string;
                let vehicleId: number;

                if (fullText) {
                    vehicleName = fullText.trim().toUpperCase();
                    const result: number = vehicleList[vehicleName];

                    if (result) {
                        vehicleId = result;
                    }
                }

                if (vehicleId) {
                    const vehicle = mp.vehicles.new(vehicleId, new mp.Vector3(player.position.x, player.position.y, player.position.z), {
                        heading: player.heading,
                        dimension: player.dimension,
                    });

                    player.putIntoVehicle(vehicle, 0);
                    player.outputChatBox(`${vehicleName} (ID: ${vehicleId}) spawned!`);
                    Logger.info(`${player.firstName} ${player.lastName} (ID: ${player.id}) spawned a ${vehicleName} (ID: ${vehicleId})`);
                } else {
                    if (vehicleName) {
                        player.outputChatBox(`Vehicle "${vehicleName}" not found!`);
                    } else {
                        player.outputChatBox(`USAGE: /v <vehicle>`);
                    }
                }
            },
        });
    }
}

const vehicle = new Vehicle();
module.exports = vehicle;