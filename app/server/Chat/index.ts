import Logger from '../Options/sLogger';

class Chat {
    readonly COLOR_GREY: string = `#afafaf`;

    readonly DISTANCE_SPEECH: number = 10;
    readonly DISTANCE_SHOUT: number = 20;
    readonly DISTANCE_ACTION: number = 15;
    readonly DISTANCE_CONTEXT: number = 15;
    readonly DISTANCE_WHISPER: number = 5;

    readonly COLOR_SPEECH = ['#ffffff', '#cecece', '#afafaf', '#919191', '#727272'];
    readonly COLOR_ACTION = ['#c2a2da', '#a58bba', '#8a749b', '#6e5d7c', '#53465e'];
    readonly COLOR_CONTEXT = '#9acd32';

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

                player.outputChatBox(`!{${this.COLOR_GREY}}[${this.getTime()}] USAGE: /me <action>`);
            },

            'do': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateContext(player, message);
                        return;
                    }
                }

                player.outputChatBox(`!{${this.COLOR_GREY}}[${this.getTime()}] USAGE: /do <context>`);
            },

            'l': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateSpeech(player, message);
                        return;
                    }
                }

                player.outputChatBox(`!{${this.COLOR_GREY}}[${this.getTime()}] USAGE: /l <text>`);
            },

            's': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateShout(player, message);
                        return;
                    }
                }

                player.outputChatBox(`!{${this.COLOR_GREY}}[${this.getTime()}] USAGE: /s <text>`);
            },

            'w': (player: PlayerMp, message: string) => {
                if (message) {
                    message = message.trim();

                    if (message.length > 0) {
                        this.emulateWhisper(player, message);
                        return;
                    }
                }

                player.outputChatBox(`!{${this.COLOR_GREY}}[${this.getTime()}] USAGE: /w <text>`);
            },

            // 'g' : (player, fullText) => {
            //     if (!fullText) return player.notify("Please enter message");
            //     mp.players.broadcast(`[${time.getTime()}] [Global] ${player.name}: ${fullText}`);
            //     misc.log.debug(`${player.name} ${fullText}`);
            // }
        });
    }

    getTime(): string {
        const date = new Date();
        let result: string =
            `${date.getHours().toString().padStart(2, "0")}:` +
            `${date.getMinutes().toString().padStart(2, "0")}:` +
            `${date.getSeconds().toString().padStart(2, "0")}`;
        return result;
    }

    getSpeechColor(dist: number): string {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_SPEECH / this.COLOR_SPEECH.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_SPEECH[index];
    }

    getShoutColor(dist: number): string {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_SHOUT / this.COLOR_SPEECH.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_SPEECH[index];
    }

    getWhisperColor(dist: number): string {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_WHISPER / this.COLOR_SPEECH.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_SPEECH[index];
    }

    getActionColor(dist: number): string {
        let index: number = Math.floor(dist / Math.round(this.DISTANCE_ACTION / this.COLOR_ACTION.length));

        // fix index out of bounds
        if (index >= this.COLOR_SPEECH.length)
        {
            index = this.COLOR_SPEECH.length - 1;
        }

        return this.COLOR_ACTION[index];
    }

    emulateSpeech(player: PlayerMp, message: string, hide: Boolean = false) {
        mp.players.forEachInRange(player.position, this.DISTANCE_SPEECH, (client: PlayerMp) => {
            const color: string = this.getSpeechColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} says: ${message}`;
            client.outputChatBox(`!{${color}}[${this.getTime()}] ${output}`);
            Logger.debug(output);
        });
    }

    emulateShout(player: PlayerMp, message: string, hide: Boolean = false) {
        mp.players.forEachInRange(player.position, this.DISTANCE_SHOUT, (client: PlayerMp) => {
            const color: string = this.getShoutColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} shouts: ${message}`;
            client.outputChatBox(`!{${color}}[${this.getTime()}] ${output}`);
            Logger.debug(output);
        });
    }

    emulateWhisper(player: PlayerMp, message: string, hide: Boolean = false) {
        mp.players.forEachInRange(player.position, this.DISTANCE_WHISPER, (client: PlayerMp) => {
            const color: string = this.getWhisperColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} whipers: ${message}`;
            client.outputChatBox(`!{${color}}[${this.getTime()}] ${output}`);
            Logger.debug(output);
        });
    }

    emulateAction(player: PlayerMp, message: string, hide: Boolean = false) {
        mp.players.forEachInRange(player.position, this.DISTANCE_ACTION, (client: PlayerMp) => {
            const color: string = this.getActionColor(client.dist(player.position));
            const output: string = `${player.firstName} ${player.lastName} ${message}`;
            client.outputChatBox(`!{${color}}[${this.getTime()}] ${output}`);
            Logger.debug(output);
        });
    }

    emulateContext(player: PlayerMp, message: string, hide: Boolean = false) {
        mp.players.forEachInRange(player.position, this.DISTANCE_CONTEXT, (client: PlayerMp) => {
            // const color: string = this.COLOR_CONTEXT;
            const output: string = `[ID: ${player.id}] ${message}`;
            client.outputChatBox(`!{${this.COLOR_CONTEXT}}[${this.getTime()}] ${output}`);
            Logger.debug(output);
        });
    }

    //
}

const chat = new Chat();
module.exports = chat;