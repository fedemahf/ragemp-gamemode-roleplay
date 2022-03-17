import * as crypto from 'crypto'
// import Misc from '../Options/sMisc'
// import Browser from '../Options/sBrowser'
// import Logger from '../Options/sLogger'

export default class Auth {
  private readonly hashCharList: string = ''

  constructor () {
    // ASCII chars from 33 to 126
    for (let i = 33; i <= 126; ++i) {
      this.hashCharList += String.fromCharCode(i)
    }
  }

  generateSalt (): string {
    let result: string = ''

    for (let i = 0; i < 32; ++i) {
      result += this.hashCharList[crypto.randomInt(0, this.hashCharList.length)]
    }

    return result
  }

  hashPassword (password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex')
  }
}
