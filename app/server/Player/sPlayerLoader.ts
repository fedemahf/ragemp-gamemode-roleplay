/// <reference path="../index.d.ts" />

import PedHash = require('./PedHash')

export default class PlayerLoader {
  constructor (player: PlayerMp) {
    this.loadMethods(player)
  }

  loadMethods (player: PlayerMp): void {
    player.updateName = function () {
      this.name = `${this.firstName} ${this.lastName}`
    }

    player.isDriver = function () {
      if (!this.vehicle || this.seat !== -1) return false
      return true
    }

    player.teleport = function (coord: EntityCoord) {
      this.position = coord.pos
      this.heading = coord.rot
      this.dimension = coord.dim
    }

    player.setSkin = function (skinName: string): number {
      let skinId: number = 0
      skinName = skinName.trim().toLowerCase()

      if (PedHash.list[skinName]) {
        skinId = PedHash.list[skinName]
      } else {
        const tmp: number = parseInt(skinName, 10)

        if (!isNaN(tmp) && tmp >= 0 && tmp < PedHash.hashes.length) {
          skinId = PedHash.hashes[tmp]
        }
      }

      if (skinId) {
        player.model = skinId
      }

      return skinId
    }
  }
}
