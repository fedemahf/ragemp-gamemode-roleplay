import Logger from '../Options/sLogger';
import ChatColorList from './ChatColorList';

class ChatMisc {
    insertColor(color: string | number): string {
        if (typeof(color) == 'string') {
            if (ChatColorList[color]) {
                color = ChatColorList[color];
            } else {
                color = color.replaceAll('#', '');

                if (!/^[A-fa-f0-9]{6}$/.test(color)) {
                    Logger.error(`ChatColor.insertColor(${color}): invalid value`);
                    return ``;
                }
            }
        } else {
            if (color < 0x0 || color > 0xFFFFFF) {
                Logger.error(`ChatColor.insertColor(${color}): out of bounds`);
                return ``;
            }
        }

        return `!{#${color}}`;
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

    insertColorAndTimeStamp(color: string | number): string {
        return this.insertColor(color) + this.getTimeStamp();
    }

    notLoggedError(player: PlayerMp): boolean {
        if (!player.loggedIn) {
            player.outputChatBox(this.insertColorAndTimeStamp(ChatColorList.gray) + `You are not logged!`);
            return true;
        }

        return false;
    }
}

export default new ChatMisc();
