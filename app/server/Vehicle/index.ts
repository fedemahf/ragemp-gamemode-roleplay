/// <reference path="../index.d.ts" />

import Logger from '../Options/sLogger'
import vehicleList from './VehicleList'
import ChatMisc from './../Chat/ChatMisc'
import Database from '../Database'
import { Vehicle as DatabaseVehicle } from '../Database/entity/Vehicle'

class VehicleSingleton {
  constructor () {
    mp.events.addCommand({
      v: (player: PlayerMp, fullText: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        let vehicleModelName: string = 'UNKNOWN'
        let vehicleModelId: number = 0

        if (fullText) {
          vehicleModelName = fullText.trim().toUpperCase()
          const result: number = vehicleList[vehicleModelName]

          if (result) {
            vehicleModelId = result
          }
        }

        if (vehicleModelId) {
          const vehicle: Vehicle = mp.vehicles.new(vehicleModelId, new mp.Vector3(player.position.x, player.position.y, player.position.z), {
            heading: player.heading,
            dimension: player.dimension
          })

          player.putIntoVehicle(vehicle, 0)
          player.outputChatBox(`${vehicleModelName} (ID: ${vehicleModelId}) spawned!`)
          Logger.info(`${player.firstName} ${player.lastName} (ID: ${player.id}) spawned a ${vehicleModelName} (ID: ${vehicleModelId})`)
        } else {
          if (vehicleModelName) {
            player.outputChatBox(`Vehicle "${vehicleModelName}" not found!`)
          } else {
            player.outputChatBox('USAGE: /v <vehicle>')
          }
        }
      },
      createvehicle: async (player: PlayerMp, fullText: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        let vehicleModelName: string = 'UNKNOWN'
        let vehicleModelId: number = 0

        if (fullText) {
          vehicleModelName = fullText.trim().toUpperCase()
          const result: number = vehicleList[vehicleModelName]

          if (result) {
            vehicleModelId = result
          }
        }

        if (vehicleModelId === 0) {
          if (vehicleModelName) {
            player.outputChatBox(`Vehicle "${vehicleModelName}" not found!`)
          } else {
            player.outputChatBox('USAGE: /v <vehicle>')
          }

          return
        }

        const { x, y, z } = player.position
        const rz = player.heading
        const dimension = player.dimension

        const vehicle: Vehicle = mp.vehicles.new(vehicleModelId, new mp.Vector3(x, y, z), {
          heading: rz,
          dimension: dimension
        })

        vehicle.id_sql = await Database.createVehicle(vehicleModelId, player.id_sql, x, y, z, rz, dimension)
        player.putIntoVehicle(vehicle, 0)
        player.outputChatBox(`${vehicleModelName} (ID: ${vehicleModelId}) spawned!`)
        Logger.info(`${player.firstName} ${player.lastName} (ID: ${player.id}) spawned a ${vehicleModelName} (ID: ${vehicleModelId})`)
      }
    })

    mp.events.add('playerExitVehicle', async (player: PlayerMp, vehicle: Vehicle) => {
      const id: number | undefined = vehicle.id_sql

      if (id) {
        const { x, y, z } = vehicle.position
        const rz = vehicle.heading

        if (await Database.updateVehiclePosition(id, x, y, z, rz)) {
          player.outputChatBox('Vehicle position updated')
        }
      }
    })
  }

  public async loadVehicles (): Promise<void> {
    const vehicles: DatabaseVehicle[] | null = await Database.getVehicles()

    if (vehicles !== null) {
      for (const { id, model, pos_x, pos_y, pos_z, pos_rz, dimension } of vehicles) {
        const vehicle: Vehicle = mp.vehicles.new(model, new mp.Vector3(pos_x, pos_y, pos_z), { heading: pos_rz, dimension: dimension })
        vehicle.id_sql = id
        Logger.info(`Vehicle created! ID: ${id}, model: ${model}`)
      }
    }
  }
}

const vehicleSingleton = new VehicleSingleton()
export default vehicleSingleton
export const loadVehicles = vehicleSingleton.loadVehicles
