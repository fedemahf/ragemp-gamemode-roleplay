import Logger from '../Options/sLogger';
import ChatColor from './ChatColor';
import ColorList from './ColorList';

class Chat {
    readonly DISTANCE_SPEECH: number = 10;
    readonly DISTANCE_SHOUT: number = 20;
    readonly DISTANCE_ACTION: number = 15;
    readonly DISTANCE_CONTEXT: number = 15;
    readonly DISTANCE_WHISPER: number = 5;

    readonly COLOR_SPEECH: Array<number> = [0xFFFFFF, 0xCECECE, 0xAFAFAF, 0x919191, 0x727272];
    readonly COLOR_ACTION: Array<number> = [0xC2A2DA, 0xA58BBA, 0x8A749B, 0x6E5D7C, 0x53465E];
    readonly COLOR_CONTEXT: number = 0x9ACD32;

    constructor() {
        mp.events.add('playerChat', (player: PlayerMp, message: string) => {
            if (message) {
                message = message.trim();

                if (message.length > 0) {
                    this.emulateSpeech(player, message);
                }
            }
        });

        mp.events.addCommand({
            'me': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateAction(player, message);
                        return;
                    }
                }

                player.outputChatBox(ChatColor.insertColor(ColorList.gray) + this.getTimeStamp() + `USAGE: /me <action>`);
            },

            'do': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateContext(player, message);
                        return;
                    }
                }

                player.outputChatBox(ChatColor.insertColor(ColorList.gray) + this.getTimeStamp() + `USAGE: /do <context>`);
            },

            'l': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateSpeech(player, message);
                        return;
                    }
                }

                player.outputChatBox(ChatColor.insertColor(ColorList.gray) + this.getTimeStamp() + `USAGE: /l <text>`);
            },

            's': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateShout(player, message);
                        return;
                    }
                }

                player.outputChatBox(ChatColor.insertColor(ColorList.gray) + this.getTimeStamp() + `USAGE: /s <text>`);
            },

            'w': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateWhisper(player, message);
                        return;
                    }
                }

                player.outputChatBox(ChatColor.insertColor(ColorList.gray) + this.getTimeStamp() + `USAGE: /w <text>`);
            },

            // 'g' : (player, fullText) => {
            //     if (!fullText) return player.notify("Please enter message");
            //     mp.players.broadcast(`[${time.getTime()}] [Global] ${player.name}: ${fullText}`);
            //     misc.log.debug(`${player.name} ${fullText}`);
            // }
        });
    }

    getTimeStamp(): string {
        const date = new Date();
        let result: string =
            `[` +
            `${date.getHours().toString().padStart(2, "0")}:` +
            `${date.getMinutes().toString().padStart(2, "0")}:` +
            `${date.getSeconds().toString().padStart(2, "0")}` +
            `]`;
        return result;
    }

    getSpeechColor(dist: number): number {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_SPEECH / this.COLOR_SPEECH.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_SPEECH[index];
    }

    getShoutColor(dist: number): number {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_SHOUT / this.COLOR_SPEECH.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_SPEECH[index];
    }

    getWhisperColor(dist: number): number {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_WHISPER / this.COLOR_SPEECH.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_SPEECH[index];
    }

    getActionColor(dist: number): number {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_ACTION / this.COLOR_ACTION.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_ACTION[index];
    }

    emulateSpeech(player: PlayerMp, message: string): void {
        mp.players.forEachInRange(player.position, this.DISTANCE_SPEECH, (client: PlayerMp) => {
            const color: number = this.getSpeechColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} says: ${message}`;
            client.outputChatBox(ChatColor.insertColor(color) + this.getTimeStamp() + output);
            Logger.debug(output);
        });
    }

    emulateShout(player: PlayerMp, message: string): void {
        mp.players.forEachInRange(player.position, this.DISTANCE_SHOUT, (client: PlayerMp) => {
            const color: number = this.getShoutColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} shouts: ${message}`;
            client.outputChatBox(ChatColor.insertColor(color) + this.getTimeStamp() + output);
            Logger.debug(output);
        });
    }

    emulateWhisper(player: PlayerMp, message: string): void {
        mp.players.forEachInRange(player.position, this.DISTANCE_WHISPER, (client: PlayerMp) => {
            const color: number = this.getWhisperColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} whipers: ${message}`;
            client.outputChatBox(ChatColor.insertColor(color) + this.getTimeStamp() + output);
            Logger.debug(output);
        });
    }

    emulateAction(player: PlayerMp, message: string): void {
        mp.players.forEachInRange(player.position, this.DISTANCE_ACTION, (client: PlayerMp) => {
            const color: number = this.getActionColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} ${message}`;
            client.outputChatBox(ChatColor.insertColor(color) + this.getTimeStamp() + output);
            Logger.debug(output);
        });
    }

    emulateContext(player: PlayerMp, message: string): void {
        mp.players.forEachInRange(player.position, this.DISTANCE_CONTEXT, (client: PlayerMp) => {
            // const color: string = this.COLOR_CONTEXT;
            const output: string = `[ID: ${player.id}] ${message}`;
            client.outputChatBox(ChatColor.insertColor(this.COLOR_CONTEXT) + this.getTimeStamp() + output);
            Logger.debug(output);
        });
    }
}

const chat = new Chat();
module.exports = chat;
