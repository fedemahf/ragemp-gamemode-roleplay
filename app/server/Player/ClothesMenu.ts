/// <reference path="../index.d.ts" />

mp.events.add('setClothes', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
	player.setClothes(componentId, drawable, texture, 2);
    player.clothes[componentId] = {drawable: drawable, texture: texture};
});

mp.events.add('setProp', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
	player.setProp(componentId, drawable, texture);
    player.props[componentId] = {drawable: drawable, texture: texture};
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

mp.events.add("ClothesMenu_Reload", (player: PlayerMp) => {
    for (let i = 0; i < player.props.length; ++i) {
        if (player.props[i] !== undefined) {
            player.setProp(i, player.props[i].drawable, player.props[i].texture);
        }
    }

    for (let i = 0; i < player.clothes.length; ++i) {
        if (player.clothes[i] !== undefined) {
            player.setClothes(i, player.clothes[i].drawable, player.clothes[i].texture, 2);
        }
    }
});

mp.events.add("playerJoin", (player: PlayerMp) => {
    player.clothes = [];
    player.props = [];
});
