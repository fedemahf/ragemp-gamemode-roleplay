import Logger from '../Options/sLogger';
import ChatColorList from './ChatColorList';

class ChatMisc {
    private insertColor(color: string | number): string {
        let result: string = ``;

        if (typeof(color) == 'string') {
            if (ChatColorList[color]) {
                result = `!{#${ChatColorList[color].toString(16)}}`;
            } else {
                if (/^#?[A-fa-f0-9]{6}$/.test(color)) {
                    if (color[0] == '#') {
                        result = `!{${ChatColorList[color].toString(16)}}`;
                    } else {
                        result = `!{#${ChatColorList[color].toString(16)}}`;
                    }
                } else {
                    Logger.error(`ChatColor.insertColor("${color}"): invalid value`);
                }
            }
        } else {
            if (color >= 0x0 && color <= 0xFFFFFF) {
                result = `!{#${color.toString(16)}}`;
            } else {
                Logger.error(`ChatColor.insertColor(0x${color.toString(16)}): out of bounds`);
            }
        }

        return result;
    }

    private getTimeStamp(): string {
        const date = new Date();
        let result: string =
            `[` +
            `${date.getHours().toString().padStart(2, "0")}:` +
            `${date.getMinutes().toString().padStart(2, "0")}:` +
            `${date.getSeconds().toString().padStart(2, "0")}` +
            `]`;
        return result;
    }

    public insertColorAndTimeStamp(color: string | number): string {
        return this.insertColor(color) + this.getTimeStamp() + ' ';
    }

    public notLoggedError(player: PlayerMp): boolean {
        if (!player.loggedIn) {
            player.outputChatBox(this.insertColorAndTimeStamp(ChatColorList.gray) + `You are not logged!`);
            return true;
        }

        return false;
    }
}

export default new ChatMisc();
