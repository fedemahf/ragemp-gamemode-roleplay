/// <reference path="../index.d.ts" />

// import DB from '../Options/sDB'
// import Logger from '../Options/sLogger'
import PlayerLoader from './sPlayerLoader'
import Browser from '../Options/sBrowser'
import Camera from '../Options/sCamera'
import Database from '../Database'
import { Player } from '../Database/entity/Player'

class PlayerSingletone {
  startCoord: EntityCoord

  constructor () {
    this.startCoord = {
      pos: new mp.Vector3(-164.0, 6426.0, 32.0),
      rot: 120,
      dim: 0
    }
  }

  async loadAccount (player: PlayerMp, user_id: number): Promise<void> {
    const databasePlayer: Player | null = await Database.getPlayerByUserId(user_id)

    if (databasePlayer === null) {
      Browser.showNotification(player, 'Character not found!', 'red', 4, 'Error', 'error.svg')
      player.admin = 0
      return
    }

    const coord: EntityCoord = {
      pos: new mp.Vector3(databasePlayer.pos_x, databasePlayer.pos_y, databasePlayer.pos_z),
      rot: databasePlayer.pos_rz,
      dim: databasePlayer.dimension
    }

    player.user_id = user_id
    player.id_sql = databasePlayer.id
    player.firstName = databasePlayer.firstName
    player.lastName = databasePlayer.lastName

    Browser.setLoadingScreenState(player, true)
    Browser.setUrl(player, '/', false)
    Camera.resetCamera(player)

    // eslint-disable-next-line no-new
    new PlayerLoader(player)
    player.updateName()

    setTimeout(() => {
      // player.teleport(JSON.parse(databasePlayer.position));
      player.teleport(coord)
    }, 500)
    setTimeout(() => {
      Browser.setLoadingScreenState(player, false)
    }, 1000)

    player.loggedIn = true
    player.call('cMisc-CallServerEvent', ['CharCreator_LoadCharacter'])
    player.call('cMisc-CallServerEvent', ['ClothesMenu_Load'])
  }
}

export default new PlayerSingletone()
