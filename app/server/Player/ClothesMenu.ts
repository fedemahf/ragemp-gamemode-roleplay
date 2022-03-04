/// <reference path="../index.d.ts" />

mp.events.add('setClothes', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
	player.setClothes(componentId, drawable, texture, 2);
});

mp.events.add('setProp', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
	player.setProp(componentId, drawable, texture);
});

const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];

mp.events.addCommand("clothes", (player: PlayerMp) => {
    if (freemodeCharacters.indexOf(player.model) == -1) {
        player.outputChatBox("/clothes command is restricted to freemode characters.");
    } else if (player.vehicle) {
        player.outputChatBox("You can't use this command inside a vehicle.");
    } else {
        player.call("toggleClothesMenu");
    }
});
