/// <reference path="../index.d.ts" />

import Logger from '../Options/sLogger'
import vehicleList from './VehicleList'
import ChatMisc from './../Chat/ChatMisc'
import Database from '../Database'
import { Vehicle, DatabaseVehicle } from './Vehicle'

class VehicleSingleton {
  public vehicles: Vehicle[] = []

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
        let databaseVehicle: DatabaseVehicle | undefined

        try {
          databaseVehicle = await Database.createVehicle(vehicleModelId, player.id_sql, x, y, z, rz, dimension)
        } catch (e) {
          player.outputChatBox('Error creating vehicle')
          Logger.error('Error creating vehicle')
          console.error(e)
        }

        if (databaseVehicle) {
          const vehicle: Vehicle = mp.vehicles.new(vehicleModelId, new mp.Vector3(x, y, z), {
            heading: rz,
            dimension: dimension
          })

          vehicle.database = databaseVehicle
          this.vehicles.push(vehicle)

          player.putIntoVehicle(vehicle, 0)
          player.outputChatBox(`${vehicleModelName} (ID: ${vehicleModelId}) spawned!`)
          Logger.info(`${player.firstName} ${player.lastName} (ID: ${player.id}) spawned a ${vehicleModelName} (ID: ${vehicleModelId})`)
        }
      },
      getvehicle: async (player: PlayerMp, fullText: string, inputVehicle: string): Promise<void> => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (!inputVehicle) {
          player.outputChatBox('USAGE: /getvehicle <id>')
          return
        }

        inputVehicle = inputVehicle.trim()

        if (!/^[0-9]+$/.test(inputVehicle)) {
          player.outputChatBox('Invalid vehicle ID. Use only positive digits.')
          return
        }

        const vehicleid: number = parseInt(inputVehicle, 10)
        const vehicle: Vehicle | undefined = this.getByDatabaseId(vehicleid)

        if (!vehicle) {
          player.outputChatBox(`Vehicle '${inputVehicle}' not found!`)
          return
        }

        // Get current player's position
        let { x, y, z } = player.position
        const rz = player.heading

        // Convert rotation from degree to radians
        const rzRadians = rz * (Math.PI / 180)

        // Calculate player's front
        x += Math.sin(rzRadians) * -2.0
        y += Math.cos(rzRadians) * 2.0

        // Set the new vehicle position and rotation
        vehicle.position = new mp.Vector3(x, y, z)
        vehicle.rotation = new mp.Vector3(0, 0, rz + 90.0)

        // Save in db
        void this.savePosition(vehicle)

        // Output message
        player.outputChatBox(`The vehicle SQLID:${vehicleid} was moved`)
      }
    })

    mp.events.add('playerExitVehicle', async (player: PlayerMp, vehicle: Vehicle) => {
      if (await this.savePosition(vehicle)) {
        player.outputChatBox('Vehicle position updated')
      }
    })
  }

  public async loadVehicles (): Promise<void> {
    const vehicles: DatabaseVehicle[] | null = await Database.getVehicles()

    if (vehicles !== null) {
      for (const databaseVehicle of vehicles) {
        const { id, model, pos_x, pos_y, pos_z, pos_rz, dimension } = databaseVehicle
        const vehicle: Vehicle = mp.vehicles.new(model, new mp.Vector3(pos_x, pos_y, pos_z), { heading: pos_rz, dimension: dimension })
        vehicle.database = databaseVehicle
        this.vehicles.push(vehicle)
        Logger.info(`Vehicle created! ID: ${id}, model: ${model}`)
      }
    }
  }

  public async savePosition (vehicle: Vehicle): Promise<boolean> {
    const id: number | undefined = vehicle.database?.id

    if (id) {
      const { x, y, z } = vehicle.position
      const rz = vehicle.heading

      if (await Database.updateVehiclePosition(id, x, y, z, rz)) {
        return true
      }
    }

    return false
  }

  public getByDatabaseId (databaseId: number | undefined): Vehicle | undefined {
    return databaseId ? this.vehicles.find(v => v.database?.id === databaseId) : undefined
  }
}

const vehicleSingleton = new VehicleSingleton()
export default vehicleSingleton
export const loadVehicles = vehicleSingleton.loadVehicles.bind(vehicleSingleton)
