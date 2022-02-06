/// <reference path="../index.d.ts" />

// import Logger from '../Options/sLogger';
import vehicleList from './VehicleList';

class Vehicle {
    constructor() {
        mp.events.addCommand({
            'v': (player: PlayerMp, fullText: string) => {
                let vehicleId = RageEnums.Hashes.Vehicle.HYDRA;
        
                if (fullText) {
                    let vehicleName = fullText.trim().toUpperCase();
                    let result = vehicleList.find(car => {car.name == vehicleName});
        
                    if (result != undefined) {
                        vehicleId = result.code;
                        player.outputChatBox(`${vehicleName} = ${vehicleId}`);
                    }
                }
        
                const vehicle = mp.vehicles.new(vehicleId, new mp.Vector3(player.position.x, player.position.y, player.position.z), {
                    heading: player.heading,
                    dimension: player.dimension,
                });

                player.putIntoVehicle(vehicle, 0);
            },
        });
    }
}

const vehicle = new Vehicle();
module.exports = vehicle;