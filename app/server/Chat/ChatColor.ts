import Logger from '../Options/sLogger';
import ColorList from './ColorList';

class ColorChat {
    insertColor(color: string | number): string {
        if (typeof(color) == 'string') {
            if (ColorList[color]) {
                color = ColorList[color];
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
}

const colorChat = new ColorChat();
export default colorChat;
