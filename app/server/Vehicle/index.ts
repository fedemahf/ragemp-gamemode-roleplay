/// <reference path="../index.d.ts" />

import Logger from '../Options/sLogger';
import vehicleList from './VehicleList';
import ChatMisc from './../Chat/ChatMisc';
import DB from '../Options/sDB';

class VehicleSingleton {
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
                    const vehicle: Vehicle = mp.vehicles.new(vehicleId, new mp.Vector3(player.position.x, player.position.y, player.position.z), {
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
            'createvehicle': async (player: PlayerMp, fullText: string) => {
                if (ChatMisc.notLoggedError(player)) {
                    return
                }

                let vehicleName: string
                let vehicleId: number

                if (fullText) {
                    vehicleName = fullText.trim().toUpperCase()
                    const result: number = vehicleList[vehicleName]

                    if (result) {
                        vehicleId = result
                    }
                }

                if (vehicleId) {
                    const result: any = await DB.query(`INSERT INTO vehicle (model, pos_x, pos_y, pos_z, pos_rz, dimension) VALUES ('${DB.escape(vehicleId)}', '${DB.escape(player.position.x)}', '${DB.escape(player.position.y)}', '${DB.escape(player.position.z)}', '${DB.escape(player.heading)}', '${DB.escape(player.dimension)}')`)

                    if (result.insertId) {
                        const vehicle: Vehicle = mp.vehicles.new(vehicleId, new mp.Vector3(player.position.x, player.position.y, player.position.z), {
                            heading: player.heading,
                            dimension: player.dimension
                        })

                        vehicle.id_sql = result.insertId
                        player.putIntoVehicle(vehicle, 0)
                        player.outputChatBox(`${vehicleName} (ID: ${vehicleId}) spawned!`)
                        Logger.info(`${player.firstName} ${player.lastName} (ID: ${player.id}) spawned a ${vehicleName} (ID: ${vehicleId})`)
                    } else {
                        player.outputChatBox(`There was an error with the SQL query. Try again.`)
                    }
                } else {
                    if (vehicleName) {
                        player.outputChatBox(`Vehicle "${vehicleName}" not found!`)
                    } else {
                        player.outputChatBox(`USAGE: /v <vehicle>`)
                    }
                }
            }
        });

        mp.events.add("playerExitVehicle", async (player: PlayerMp, vehicle: Vehicle) => {
            if (vehicle.id_sql) {
                await DB.query(`UPDATE vehicle SET pos_x = '${vehicle.position.x}', pos_y = '${vehicle.position.y}', pos_z = '${vehicle.position.z}', pos_rz = '${vehicle.heading}' WHERE id = '${vehicle.id_sql}'`)
                player.outputChatBox(`Vehicle position updated`)
            }
            
        });
    }

    public async loadVehicles() {
        const result: any = await DB.query(`SELECT * FROM vehicle`)

        if (result[0]) {
            for (let {id, model, pos_x, pos_y, pos_z, pos_rz, dimension} of result) {
                const vehicle: Vehicle = mp.vehicles.new(model, new mp.Vector3(pos_x, pos_y, pos_z), {heading: pos_rz, dimension: dimension})
                vehicle.id_sql = id;
                Logger.info(`Vehicle created! ID: ${id}, model: ${model}`)
            }
        }
    }
}

const vehicleSingleton = new VehicleSingleton();
export default vehicleSingleton;
