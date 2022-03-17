/// <reference path="../index.d.ts" />

import Auth from './sAuth'
import Browser from '../Options/sBrowser'
import Camera from '../Options/sCamera'
import Logger from '../Options/sLogger'
import DB from '../Options/sDB'
import PlayerSingletone from '../Player/sPlayerSingletone'

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

  async login (player: PlayerMp, data: string): Promise<void> {
    const obj = JSON.parse(data)
    let email: string = obj.email
    email = email.toLowerCase()

    const result: any = await DB.query(`SELECT id, password, salt, admin FROM user WHERE email = ${DB.escape(email)} LIMIT 1`)
    if (!result[0]) {
      Browser.showNotification(player, 'This email doesn\'t exists!', 'red', 4, 'Wrong email address', 'error.svg')
      Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} entered wrong email! Email: ${email}`)
    } else {
      const user_id: number = result[0].id
      const password1: string = result[0].password
      const password2: string = this.hashPassword(obj.password, result[0].salt)
      const admin: number = result[0].admin

      if (password1 !== password2) {
        Browser.showNotification(player, 'Wrong password', 'red', 4, 'Error', 'error.svg')
        Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} entered wrong password! Email: ${email}`)
      } else if (this.isAlreadyPlaying(user_id)) {
        Browser.showNotification(player, 'This user already playing now!', 'red', 4, 'Error', 'error.svg')
        Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} tried to log in from another PC! Email: ${email}`)
      } else {
        player.admin = admin
        await PlayerSingletone.loadAccount(player, user_id)
      }
    }
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
