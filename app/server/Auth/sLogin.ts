/// <reference path="../index.d.ts" />

import Auth from './sAuth'
import Browser from '../Options/sBrowser'
import Camera from '../Options/sCamera'
import Logger from '../Options/sLogger'
// import DB from '../Options/sDB'
import PlayerSingletone from '../Player/sPlayerSingletone'
import Database from '../Database'
import { User as DatabaseUser } from '../Database/entity/User'

class Login extends Auth {
  loginScreenPlayerPos: Vector3Mp
  camPos1: Vector3Mp
  camPos2: Vector3Mp
  camViewangle: number

  constructor () {
    super()
    this.loginScreenPlayerPos = new mp.Vector3(3294, 5216, 17)
    this.camPos1 = new mp.Vector3(3331.6, 5222.5, 23)
    this.camPos2 = new mp.Vector3(0, 0, 212)
    this.camViewangle = 55

    mp.events.add({
      playerReady: (player: PlayerMp) => {
        this.playerReady(player)
      },

      'sLogin-Login': (player: PlayerMp, data: string) => {
        void this.login(player, data)
      }
    })
  }

  playerReady (player: PlayerMp): void {
    Camera.createCamera(player, this.camPos1, this.camPos2, this.camViewangle)
    player.spawn(this.loginScreenPlayerPos)
    player.dimension = 0
    Browser.setUrl(player, '/login', true)
    Logger.debug(`${player.name} connected`)
  }

  async login (player: PlayerMp, inputString: string): Promise<void> {
    const input = JSON.parse(inputString)
    const user: DatabaseUser | null = await Database.getUserByEmail(input.email.toLowerCase())

    if (user === null) {
      Browser.showNotification(player, 'This email doesn\'t exists!', 'red', 4, 'Wrong email address', 'error.svg')
      Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} entered wrong email! Email: ${input.email}`)
      return
    }

    if (user.password !== this.hashPassword(input.password, user.salt)) {
      Browser.showNotification(player, 'Wrong password', 'red', 4, 'Error', 'error.svg')
      Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} entered wrong password! Email: ${input.email}`)
      return
    }

    if (this.isAlreadyPlaying(user.id)) {
      Browser.showNotification(player, 'This user already playing now!', 'red', 4, 'Error', 'error.svg')
      Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} tried to log in from another PC! Email: ${input.email}`)
      return
    }

    player.admin = user.admin
    await PlayerSingletone.loadAccount(player, user.id)
  }

  private isAlreadyPlaying (user_id: number): boolean {
    for (const player of mp.players.toArray()) {
      if (player.loggedIn && player.user_id === user_id) {
        return true
      }
    }

    return false
  }
}

// eslint-disable-next-line no-new
new Login()
