import Auth from './sAuth'
import Browser from '../Options/sBrowser'
// import PlayerSingletone from '../Player/sPlayerSingletone'
import Database from '../Database'
import Logger from '../Options/sLogger'

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
      return
    }

    if (await Database.userEmailAlreadyExists(email)) {
      Browser.showNotification(player, 'This email already exists!', 'red', 4, 'Wrong email address', 'error.svg')
      return
    }

    Browser.showNotification(player, 'You can use this email!', 'green', 4, 'Success')
    this.setRegistrationEmailChecked(player, true)
  }

  async checkName (player: PlayerMp, dataString: string): Promise<void> {
    const input = JSON.parse(dataString)

    if (!this.isNameValid(input.firstName) || !this.isNameValid(input.lastName)) {
      Browser.showNotification(player, 'The name is not valid!', 'red', 4, 'Error', 'error.svg')
      return
    }

    if (await Database.playerNameAlreadyExists(input.firstName, input.lastName)) {
      Browser.showNotification(player, 'This name already exists!', 'red', 4, 'Error', 'error.svg')
      return
    }

    this.setRegistrationNameAvailable(player, true)
    Browser.showNotification(player, 'You can use this name!', 'green', 4, 'Success')
  }

  async tryToCreateAccount (player: PlayerMp, inputString: string): Promise<void> {
    const input = JSON.parse(inputString)

    if (!this.isNameValid(input.firstName) || !this.isNameValid(input.lastName)) {
      Browser.showNotification(player, 'The name is not valid!', 'red', 4, 'Error', 'error.svg')
      return
    }

    if (!this.isEmailValid(input.email)) {
      Browser.showNotification(player, 'The email is not valid!', 'red', 4, 'Error', 'error.svg')
      return
    }

    if (await Database.userEmailAlreadyExists(input.email) || await Database.playerNameAlreadyExists(input.firstName, input.lastName)) {
      Browser.showNotification(player, 'There was an error creating your account, please try again', 'red', 4, 'Error', 'error.svg')
      return
    }

    await this.createAccount(player, input.email, input.firstName, input.lastName, input.password)
  }

  async createAccount (player: PlayerMp, email: string, firstName: string, lastName: string, password: string): Promise<void> {
    const salt = this.generateSalt()
    const hashedPassword = this.hashPassword(password, salt)
    await Database.createUser(email, firstName, lastName, hashedPassword, salt)
    Logger.debug(`New Account: ${email} | ${firstName} ${lastName} | ${player.socialClub}`)
    Browser.showNotification(player, `Welcome to Los Santos, ${firstName} ${lastName}!`, 'green', 8, 'Success')
    player.call('cMisc-CallServerEvent', ['sLogin-Login', JSON.stringify({ email: email.toLowerCase(), password: password })])
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
