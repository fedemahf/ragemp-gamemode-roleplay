import Auth from './sAuth';
import DB from '../Options/sDB';
import Browser from '../Options/sBrowser';
import PlayerSingletone from '../Player/sPlayerSingletone';


class Register extends Auth {
    constructor() {
        super();
        mp.events.add({		
			"sRegister-CheckEmail" : (player: PlayerMp, email: string) => {
                this.checkEmail(player, email);
            },

            "sRegister-CheckName" : (player: PlayerMp, data: string) => {
                this.checkName(player, data);
            },

            "sRegister-CreateAccount" : (player: PlayerMp, data: string) => {
                this.tryToCreateAccount(player, data);
            },
		});

    }

    isEmailValid(email: string) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    }

    isNameValid(name: string) {
        return /^[A-Z][A-Za-z]+$/.test(name);
    }

    async checkEmail(player: PlayerMp, email: string) {
        if (!this.isEmailValid(email)) {
            Browser.showNotification(player, `Please, check your email address!`, `red`, 4, `Wrong email address`, `error.svg`);
        }
        else
        {
            const d: any = await DB.query(`SELECT email FROM users WHERE email = ${DB.escape(email)} LIMIT 1`);

            if (d[0]) {
                Browser.showNotification(player, `This email already exists!`, `red`, 4, `Wrong email address`, `error.svg`);
            }
            else
            {
                Browser.showNotification(player, `You can use this email!`, `green`, 4, `Success`);
                this.setRegistrationEmailChecked(player, true);
            }
        }
    }

    async checkName(player: PlayerMp, obj: string) {
        let error: string = "";
        const data = JSON.parse(obj);

        if (!this.isNameValid(data.firstName) || !this.isNameValid(data.lastName)) {
            error = "The name is not valid!";
        } else {
            const d: any = await DB.query(`SELECT firstName, lastName FROM users WHERE firstName = ${DB.escape(data.firstName)} AND lastName = ${DB.escape(data.lastName)} LIMIT 1`);

            if (d[0]) {
                error = "This name already exists!";
            }
        }

        if (error.length > 0) {
            Browser.showNotification(player, error, `red`, 4, `Error`, `error.svg`);
        } else {
            this.setRegistrationNameAvailable(player, true);
            Browser.showNotification(player, `You can use this name!`, `green`, 4, `Success`);
        }
    }

    async tryToCreateAccount(player: PlayerMp, obj: string) {
        let error: string = "";
        const data = JSON.parse(obj);

        if (!this.isNameValid(data.firstName) || !this.isNameValid(data.lastName)) {
            error = "The name is not valid!";
        } else if (!this.isEmailValid(data.email)) {
            error = "The email is not valid!";
        } else {
            const result: any = await DB.query(`SELECT email FROM users WHERE email = ${DB.escape(data.email)} OR (firstName = ${DB.escape(data.firstName)} AND lastName = ${DB.escape(data.lastName)}) LIMIT 1`);

            if (result[0]) {
                error = "There was an error creating your account, please try again";
            }
        }

        if (error.length > 0) {
            Browser.showNotification(player, error, `red`, 4, `Error`, `error.svg`);
        } else {
            this.createAccount(player, data.email, data.firstName, data.lastName, data.password);
        }
    }

    async createAccount(player: PlayerMp, email: string, firstName: string, lastName: string, password: string) {
        const salt = this.generateSalt();
        const pass = this.hashPassword(password, salt);
        await PlayerSingletone.createUser(player, email, firstName, lastName, pass, salt);
        Browser.showNotification(player, `Welcome to Los Santos, ${firstName} ${lastName}!`, `green`, 8, `Success`);
        const obj = {
            email: email.toLowerCase(),
            password: password
        }
        player.call("cMisc-CallServerEvent", ["sLogin-Login", JSON.stringify(obj)]);
    }

    setRegistrationNameAvailable(player: PlayerMp, status: boolean) {
        Browser.pasteJs(player, `appData.views.Register.nameAvailable = ${status};`);
    }

    setRegistrationEmailChecked(player: PlayerMp, status: boolean) {
        Browser.pasteJs(player, `appData.views.Register.emailChecked = ${status};`);
    }

}
new Register();