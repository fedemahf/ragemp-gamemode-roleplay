import Auth from './sAuth'
import DB from '../Options/sDB'
import Browser from '../Options/sBrowser'
import PlayerSingletone from '../Player/sPlayerSingletone'

class Register extends Auth {
  constructor () {
    super()
    mp.events.add({
      'sRegister-CheckEmail': (player: PlayerMp, email: string) => {
        void this.checkEmail(player, email)
      },

      'sRegister-CheckName': (player: PlayerMp, data: string) => {
        void this.checkName(player, data)
      },

      'sRegister-CreateAccount': (player: PlayerMp, data: string) => {
        void this.tryToCreateAccount(player, data)
      }
    })
  }

  isEmailValid (email: string): boolean {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)
  }

  isNameValid (name: string): boolean {
    return /^[A-Z][A-Za-z]+$/.test(name)
  }

  async checkEmail (player: PlayerMp, email: string): Promise<void> {
    if (!this.isEmailValid(email)) {
      Browser.showNotification(player, 'Please, check your email address!', 'red', 4, 'Wrong email address', 'error.svg')
    } else {
      const d: any = await DB.query(`SELECT id FROM user WHERE email = ${DB.escape(email)} LIMIT 1`)

      if (d[0]) {
        Browser.showNotification(player, 'This email already exists!', 'red', 4, 'Wrong email address', 'error.svg')
      } else {
        Browser.showNotification(player, 'You can use this email!', 'green', 4, 'Success')
        this.setRegistrationEmailChecked(player, true)
      }
    }
  }

  async checkName (player: PlayerMp, obj: string): Promise<void> {
    let error: string = ''
    const data = JSON.parse(obj)

    if (!this.isNameValid(data.firstName) || !this.isNameValid(data.lastName)) {
      error = 'The name is not valid!'
    } else {
      const d: any = await DB.query(`SELECT id FROM player WHERE firstName = ${DB.escape(data.firstName)} AND lastName = ${DB.escape(data.lastName)} LIMIT 1`)

      if (d[0]) {
        error = 'This name already exists!'
      }
    }

    if (error.length > 0) {
      Browser.showNotification(player, error, 'red', 4, 'Error', 'error.svg')
    } else {
      this.setRegistrationNameAvailable(player, true)
      Browser.showNotification(player, 'You can use this name!', 'green', 4, 'Success')
    }
  }

  async tryToCreateAccount (player: PlayerMp, obj: string): Promise<void> {
    let error: string = ''
    const data = JSON.parse(obj)

    if (!this.isNameValid(data.firstName) || !this.isNameValid(data.lastName)) {
      error = 'The name is not valid!'
    } else if (!this.isEmailValid(data.email)) {
      error = 'The email is not valid!'
    } else {
      const result1: any = await DB.query(`SELECT id FROM user WHERE email = ${DB.escape(data.email)} LIMIT 1`)
      const result2: any = await DB.query(`SELECT id FROM player WHERE firstName = ${DB.escape(data.firstName)} AND lastName = ${DB.escape(data.lastName)} LIMIT 1`)

      if (result1[0] || result2[0]) {
        error = 'There was an error creating your account, please try again'
      }
    }

    if (error.length > 0) {
      Browser.showNotification(player, error, 'red', 4, 'Error', 'error.svg')
    } else {
      await this.createAccount(player, data.email, data.firstName, data.lastName, data.password)
    }
  }

  async createAccount (player: PlayerMp, email: string, firstName: string, lastName: string, password: string): Promise<void> {
    const salt = this.generateSalt()
    const pass = this.hashPassword(password, salt)
    const result = await PlayerSingletone.createUser(player, email, firstName, lastName, pass, salt)

    if (!result) {
      Browser.showNotification(player, 'There was an error creating your account, please try again', 'red', 4, 'Error', 'error.svg')
    } else {
      Browser.showNotification(player, `Welcome to Los Santos, ${firstName} ${lastName}!`, 'green', 8, 'Success')
      player.call('cMisc-CallServerEvent', ['sLogin-Login', JSON.stringify({ email: email.toLowerCase(), password: password })])
    }
  }

  setRegistrationNameAvailable (player: PlayerMp, status: boolean): void {
    Browser.pasteJs(player, `App.Register.setNameAvailable(${status});`)
  }

  setRegistrationEmailChecked (player: PlayerMp, status: boolean): void {
    Browser.pasteJs(player, `App.Register.setEmailChecked(${status});`)
  }
}

// eslint-disable-next-line no-new
new Register()
