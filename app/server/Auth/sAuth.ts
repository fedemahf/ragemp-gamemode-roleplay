import * as crypto from 'crypto';
import Misc from '../Options/sMisc';
import Browser from '../Options/sBrowser';
import Logger from '../Options/sLogger';

export default class Auth {
    constructor() {

    }

    hashPassword(pass: string) {
        const cipher = crypto.createCipher('aes256', 'a pass');
        let encrypted = cipher.update(pass, 'utf8', 'hex'); 
        encrypted += cipher.final('hex');
        return encrypted;
    }
}