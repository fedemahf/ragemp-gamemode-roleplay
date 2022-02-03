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
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(email);
    }

    async checkEmail(player: PlayerMp, email: string) {
        if (!this.isEmailValid(email)) {
            Browser.showNotification(player, `Please, check your email address!`, `red`, 4, `Wrong email address`, `error.svg`);
        }
        else
        {
            const d: any = await DB.query(`SELECT email FROM users WHERE email = '${email}' LIMIT 1`);

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
        const data = JSON.parse(obj);
        const d: any = await DB.query(`SELECT firstName, lastName FROM users WHERE firstName = '${data.firstName}' AND lastName = '${data.lastName}' LIMIT 1`);
        if (d[0]) {
            Browser.showNotification(player, `This name already exists!`, `red`, 4, `Error`, `error.svg`);
            return;
        }
        this.setRegistrationNameAvailable(player, true);
        Browser.showNotification(player, `You can use this name!`, `green`, 4, `Success`);
    }

    async tryToCreateAccount(player: PlayerMp, obj: string) {
        const data = JSON.parse(obj);
        const d: any = await DB.query(`SELECT email FROM users WHERE email = '${data.email}' LIMIT 1`);
        if (d[0]) {
            Browser.showNotification(player, `This email already exists!`, `red`, 4, `Wrong email address`, `error.svg`);
            return;
        }
        this.createAccount(player, data.email, data.firstName, data.lastName, data.password);
    }

    async createAccount(player: PlayerMp, email: string, firstName: string, lastName: string, password: string) {
        const pass = this.hashPassword(password);
        await PlayerSingletone.createUser(player, email, firstName, lastName, pass);
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