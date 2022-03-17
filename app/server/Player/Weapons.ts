import ChatMisc from '../Chat/ChatMisc'
import * as Hashes from './WeaponHash.json'

// export default class Weapons {
class Weapons {
  protected list = Hashes
  protected types: string = Object.keys(this.list).join(', ')
  protected names = (type: string): string => {
    return this.list[type] ? Object.keys(this.list[type]).join(', ') : 'unknown'
  }

  constructor () {
    mp.events.addCommand({
      weapon: (player: PlayerMp, fullText: string, weaponType: string, weaponName: string) => {
        if (ChatMisc.notLoggedError(player)) {
          return
        }

        if (!fullText || !weaponType) {
          player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'USAGE: /weapon <type> <name>')
          player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'Types: ' + this.types)
        } else {
          const weaponTypeSelected: object = this.list[weaponType.toLowerCase()]

          if (!weaponTypeSelected) {
            player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'Invalid weapon type.')
          } else {
            // let names: string = Object.keys(weaponTypeSelected).join(', ');

            if (!weaponName) {
              player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'Weapon names: ' + this.names(weaponType.toLowerCase()))
            } else {
              const weaponNameSelected: string = weaponTypeSelected[weaponName.toLowerCase()]

              if (!weaponNameSelected) {
                player.outputChatBox(ChatMisc.insertColorAndTimeStamp('gray') + 'Invalid weapon name.')
              } else {
                player.giveWeapon(parseInt(weaponNameSelected, 16), 1000)
                player.outputChatBox(ChatMisc.insertColorAndTimeStamp('green') + weaponName.toLowerCase() + ' spawned!')
              }
            }
          }
        }
      }
    })
  }
}

// export const weapons = new Weapons();
// eslint-disable-next-line no-new
new Weapons()
