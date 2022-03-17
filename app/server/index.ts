import ChatMisc from './Chat/ChatMisc'
import Logger from './Options/sLogger'
import PedHash = require('./Player/PedHash')

require('./Auth/sLogin')
require('./Auth/sRegister')
require('./Chat')
require('./Vehicle')
require('./Player/Weapons')
require('./Player/CharCreator')
require('./Player/ClothesMenu')

mp.events.addCommand({
  pos: (player: PlayerMp) => {
    if (ChatMisc.notLoggedError(player)) {
      return
    }

    const pos = player.position
    let rot
    if (player.vehicle) rot = player.vehicle.rotation.z
    else rot = player.heading
    const str = `x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, rot: ${rot}, dim: ${player.dimension}`
    player.outputChatBox(str)
  },

  respawn: (player: PlayerMp) => {
    if (ChatMisc.notLoggedError(player)) {
      return
    }

    if (!player.dead) {
      player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'You need to be dead to respawn!')
    } else {
      player.spawn(player.position)
      player.health = 100
      // player.tp(tp);
      player.outputChatBox(ChatMisc.insertColorAndTimeStamp('green') + 'Respawned!')
      Logger.debug(`${player.name} respawned!`)
      player.dead = false
    }
  },

  skin: (player: PlayerMp, fullText: string) => {
    if (ChatMisc.notLoggedError(player)) {
      return
    }

    if (fullText) {
      if (player.dead) {
        player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'You need to be alive to change your skin!')
      } else {
        if (player.setSkin(fullText)) {
          let skinModel: string | undefined = PedHash.getSkinModelByHash(player.model)
          let skinIndex: string = '???'

          if (skinModel !== undefined) {
            skinModel = skinModel.toUpperCase()
            skinIndex = PedHash.getSkinIndexByModel(skinModel).toString()
          } else {
            skinModel = '???'
          }

          player.outputChatBox(ChatMisc.insertColorAndTimeStamp('green') + `Skin changed! New skin: ${skinModel} (IDX: ${skinIndex}, HASH: 0x${player.model.toString(16).padStart(6, '0')})`)
        } else {
          player.outputChatBox(ChatMisc.insertColorAndTimeStamp('darkred') + 'Skin not found, try again!')
        }
      }
    } else {
      player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'USAGE: /skin <number | text>')
    }
  }
})

mp.events.add({
  playerDeath: (player: PlayerMp, reason: number, killer: PlayerMp) => {
    if (killer) {
      Logger.debug(`${player.name} death! Reason: ${reason}, killer: ${killer.name}`)
    } else {
      Logger.debug(`${player.name} death! Reason: ${reason}`)
    }

    player.dead = true
    player.outputChatBox(ChatMisc.insertColorAndTimeStamp('darkred') + 'You died! Use /respawn whenever you\'re ready.')
  },

  playerQuit: (player: PlayerMp, exitType: string, reason: string) => {
    let message: string

    switch (exitType) {
      // case "disconnect":
      //     message = `${player.name} disconnected.`;
      //     break;
      case 'timeout':
        message = `${player.name} (ID: ${player.id}) timed out.`
        break
      case 'kicked':
        message = `${player.name} (ID: ${player.id}) was kicked (reason: ${reason}).`
        break
      default:
        message = `${player.name} (ID: ${player.id}) disconnected.`
    }

    const output = ChatMisc.insertColorAndTimeStamp('gray') + `(( ${message} ))`

    mp.players.forEachInRange(player.position, 20.0, (client: PlayerMp) => {
      client.outputChatBox(output)
    })

    Logger.debug(message)
  },

  LoggerDebug: (player: PlayerMp, text: string) => {
    Logger.debug(`LoggerDebug from ${player.name} (ID: ${player.id}): ${text}`)
  }
})
