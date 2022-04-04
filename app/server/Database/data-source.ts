import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import { Player } from './entity/Player'
import { PlayerClothes } from './entity/PlayerClothes'
import { PlayerCustomization } from './entity/PlayerCustomization'
import { Vehicle } from './entity/Vehicle'

export const AppDataSource = new DataSource({
  type: 'mysql',
  // host: 'localhost',
  host: process.env.MYSQL_HOST,
  port: 3306,
  // username: 'rage',
  // password: '666',
  // database: 'test',
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Player, PlayerClothes, PlayerCustomization, Vehicle],
  migrations: [],
  subscribers: []
})
