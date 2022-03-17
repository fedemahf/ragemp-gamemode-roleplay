import Logger from '../Options/sLogger'
import ChatMisc from './ChatMisc'
import ChatColorList from './ChatColorList'

class Chat {
  readonly DISTANCE_SPEECH: number = 10
  readonly DISTANCE_SHOUT: number = 20
  readonly DISTANCE_ACTION: number = 15
  readonly DISTANCE_CONTEXT: number = 15
  readonly DISTANCE_WHISPER: number = 5

  readonly COLOR_SPEECH: number[] = [0xFFFFFF, 0xCECECE, 0xAFAFAF, 0x919191, 0x727272]
  readonly COLOR_ACTION: number[] = [0xC2A2DA, 0xA58BBA, 0x8A749B, 0x6E5D7C, 0x53465E]
  readonly COLOR_CONTEXT: number = 0x9ACD32

  constructor () {
    mp.events.add('playerChat', (player: PlayerMp, message: string) => {
      if (ChatMisc.notLoggedError(player)) {
        return
      }

      if (message) {
        message = message.trim()

        if (message.length > 0) {
          this.emulateSpeech(player, message)
        }
      }
    })

    mp.events.addCommand({
      me: (player: PlayerMp, message: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (message) {
          message = message.trim()

          if (message.length > 0) {
            this.emulateAction(player, message)
            return
          }
        }

        player.outputChatBox(ChatMisc.insertColorAndTimeStamp(ChatColorList.gray) + 'USAGE: /me <action>')
      },

      do: (player: PlayerMp, message: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (message) {
          message = message.trim()

          if (message.length > 0) {
            this.emulateContext(player, message)
            return
          }
        }

        player.outputChatBox(ChatMisc.insertColorAndTimeStamp(ChatColorList.gray) + 'USAGE: /do <context>')
      },

      l: (player: PlayerMp, message: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (message) {
          message = message.trim()

          if (message.length > 0) {
            this.emulateSpeech(player, message)
            return
          }
        }

        player.outputChatBox(ChatMisc.insertColorAndTimeStamp(ChatColorList.gray) + 'USAGE: /l <text>')
      },

      s: (player: PlayerMp, message: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (message) {
          message = message.trim()

          if (message.length > 0) {
            this.emulateShout(player, message)
            return
          }
        }

        player.outputChatBox(ChatMisc.insertColorAndTimeStamp(ChatColorList.gray) + 'USAGE: /s <text>')
      },

      w: (player: PlayerMp, message: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (message) {
          message = message.trim()

          if (message.length > 0) {
            this.emulateWhisper(player, message)
            return
          }
        }

        player.outputChatBox(ChatMisc.insertColorAndTimeStamp(ChatColorList.gray) + 'USAGE: /w <text>')
      }

      // 'g' : (player, fullText) => {
      //     if (!fullText) return player.notify("Please enter message");
      //     mp.players.broadcast(`[${time.getTime()}] [Global] ${player.name}: ${fullText}`);
      //     misc.log.debug(`${player.name} ${fullText}`);
      // }
    })
  }

  getSpeechColor (dist: number): number {
    let index: number = Math.floor(dist / Math.round(this.DISTANCE_SPEECH / this.COLOR_SPEECH.length))

    // fix index out of bounds
    if (index >= this.COLOR_SPEECH.length) {
      index = this.COLOR_SPEECH.length - 1
    }

    return this.COLOR_SPEECH[index]
  }

  getShoutColor (dist: number): number {
    let index: number = Math.floor(dist / Math.round(this.DISTANCE_SHOUT / this.COLOR_SPEECH.length))

    // fix index out of bounds
    if (index >= this.COLOR_SPEECH.length) {
      index = this.COLOR_SPEECH.length - 1
    }

    return this.COLOR_SPEECH[index]
  }

  getWhisperColor (dist: number): number {
    let index: number = Math.floor(dist / Math.round(this.DISTANCE_WHISPER / this.COLOR_SPEECH.length))

    // fix index out of bounds
    if (index >= this.COLOR_SPEECH.length) {
      index = this.COLOR_SPEECH.length - 1
    }

    return this.COLOR_SPEECH[index]
  }

  getActionColor (dist: number): number {
    let index: number = Math.floor(dist / Math.round(this.DISTANCE_ACTION / this.COLOR_ACTION.length))

    // fix index out of bounds
    if (index >= this.COLOR_SPEECH.length) {
      index = this.COLOR_SPEECH.length - 1
    }

    return this.COLOR_ACTION[index]
  }

  emulateSpeech (player: PlayerMp, message: string): void {
    const output: string = `${player.firstName} ${player.lastName} says: ${message}`

    mp.players.forEachInRange(player.position, this.DISTANCE_SPEECH, (client: PlayerMp) => {
      const color: number = this.getSpeechColor(client.dist(player.position))
      client.outputChatBox(ChatMisc.insertColorAndTimeStamp(color) + output)
    })

    Logger.debug(output)
  }

  emulateShout (player: PlayerMp, message: string): void {
    const output: string = `${player.firstName} ${player.lastName} shouts: ${message}`

    mp.players.forEachInRange(player.position, this.DISTANCE_SHOUT, (client: PlayerMp) => {
      const color: number = this.getShoutColor(client.dist(player.position))
      client.outputChatBox(ChatMisc.insertColorAndTimeStamp(color) + output)
    })

    Logger.debug(output)
  }

  emulateWhisper (player: PlayerMp, message: string): void {
    const output: string = `${player.firstName} ${player.lastName} whipers: ${message}`

    mp.players.forEachInRange(player.position, this.DISTANCE_WHISPER, (client: PlayerMp) => {
      const color: number = this.getWhisperColor(client.dist(player.position))
      client.outputChatBox(ChatMisc.insertColorAndTimeStamp(color) + output)
    })

    Logger.debug(output)
  }

  emulateAction (player: PlayerMp, message: string): void {
    const output: string = `${player.firstName} ${player.lastName} ${message}`

    mp.players.forEachInRange(player.position, this.DISTANCE_ACTION, (client: PlayerMp) => {
      const color: number = this.getActionColor(client.dist(player.position))
      client.outputChatBox(ChatMisc.insertColorAndTimeStamp(color) + output)
    })

    Logger.debug(output)
  }

  emulateContext (player: PlayerMp, message: string): void {
    const output: string = `[ID: ${player.id}] ${message}`

    mp.players.forEachInRange(player.position, this.DISTANCE_CONTEXT, (client: PlayerMp) => {
      // const color: string = this.COLOR_CONTEXT;
      client.outputChatBox(ChatMisc.insertColorAndTimeStamp(this.COLOR_CONTEXT) + output)
    })

    Logger.debug(output)
  }
}

const chat = new Chat()
module.exports = chat
