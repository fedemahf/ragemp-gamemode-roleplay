import { AppDataSource } from './data-source'
import { Player } from './entity/Player'
import { PlayerClothes } from './entity/PlayerClothes'
import { PlayerCustomization } from './entity/PlayerCustomization'
import { User } from './entity/User'
import { Vehicle } from './entity/Vehicle'
import { loadVehicles } from '../Vehicle'
import Logger from '../Options/sLogger'

class Database {
  constructor () {
    this.connect()
  }

  public async connect (): Promise<void> {
    Logger.info(`Trying to connect to database '${process.env.MYSQL_DATABASE}' as '${process.env.MYSQL_USER}' at '${process.env.MYSQL_HOST}'...`)

    AppDataSource.initialize().then(async () => {
      Logger.info('Connected to the database successfully.')

      try {
        await loadVehicles()
      } catch (error) {
        Logger.error('Error on loading server data!')
        console.error(error)
      }
    }).catch(error => {
      Logger.error("The server can't connect to the database!")
      console.error(error)
      Logger.error('Waiting 10 seconds before trying again...')
      setTimeout(() => this.connect(), 10000)
    })
  }

  public async getUserByEmail (email: string): Promise<User | null> {
    return await AppDataSource.manager.findOneBy(User, { email: email })
  }

  public async getPlayerByUserId (user_id: number): Promise<Player | null> {
    return await AppDataSource.manager.findOneBy(Player, { user_id: user_id })
  }

  public async getVehicleById (id: number): Promise<Vehicle | null> {
    return await AppDataSource.manager.findOneBy(Vehicle, { id: id })
  }

  public async getVehicles (): Promise<Vehicle[] | null> {
    return await AppDataSource.manager.find(Vehicle)
  }

  public async getPlayerCustomizationById (id: number): Promise<PlayerCustomization | null> {
    return await AppDataSource.manager.findOneBy(PlayerCustomization, { player_id: id })
  }

  public async removePlayerCustomizationById (id: number): Promise<boolean> {
    const playerCustomization = await this.getPlayerCustomizationById(id)

    if (playerCustomization === null) {
      return false
    }

    await AppDataSource.manager.remove(playerCustomization)
    return true
  }

  public async savePlayerCustomization (playerCustomization: PlayerCustomization): Promise<void> {
    await AppDataSource.manager.save(playerCustomization)
  }

  public async getPlayerClothesById (id: number): Promise<PlayerClothes[]> {
    return await AppDataSource.manager.findBy(PlayerClothes, { player_id: id })
  }

  public async removePlayerClothesById (id: number): Promise<boolean> {
    const playerClothes = await this.getPlayerClothesById(id)

    if (playerClothes === null) {
      return false
    }

    await AppDataSource.manager.remove(playerClothes)
    return true
  }

  public async savePlayerClothes (playerClothes: PlayerClothes[]): Promise<void> {
    await AppDataSource.manager.save(playerClothes)
  }

  public async userEmailAlreadyExists (email: string): Promise<boolean> {
    return await AppDataSource.manager.countBy(User, { email: email }) !== 0
  }

  public async playerNameAlreadyExists (firstName: string, lastName: string): Promise<boolean> {
    return await AppDataSource.manager.countBy(Player, { firstName: firstName, lastName: lastName }) !== 0
  }

  public async createUser (email: string, firstName: string, lastName: string, password: string, salt: string): Promise<void> {
    const user = new User()
    user.name = ''
    user.email = email
    user.password = password
    user.salt = salt
    user.admin = 0
    await AppDataSource.manager.save(user)

    const player = new Player()
    player.firstName = firstName
    player.lastName = lastName
    player.pos_x = -164.0
    player.pos_y = 6426.0
    player.pos_z = 32.0
    player.pos_rz = 120.0
    player.dimension = 0
    player.user_id = user.id
    await AppDataSource.manager.save(player)
  }

  public async createVehicle (model: number, player_id: number, pos_x: number, pos_y: number, pos_z: number, pos_rz: number, dimension: number): Promise<Vehicle> {
    const vehicle = new Vehicle()
    vehicle.model = model
    vehicle.player_id = player_id
    vehicle.pos_x = pos_x
    vehicle.pos_y = pos_y
    vehicle.pos_z = pos_z
    vehicle.pos_rz = pos_rz
    vehicle.dimension = dimension
    await AppDataSource.manager.save(vehicle)
    return vehicle
  }

  public async updateVehiclePosition (id: number, x: number, y: number, z: number, rz: number): Promise<boolean> {
    const vehicle: Vehicle | null = await this.getVehicleById(id)

    if (vehicle === null) {
      return false
    }

    vehicle.pos_x = x
    vehicle.pos_y = y
    vehicle.pos_z = z
    vehicle.pos_rz = rz
    await AppDataSource.manager.save(vehicle)

    return true
  }
}

export default new Database()
