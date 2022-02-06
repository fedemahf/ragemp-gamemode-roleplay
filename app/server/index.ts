require('./Auth/sLogin');
require('./Auth/sRegister');
require('./Chat');
require('./Vehicle');

// import * as AuthAbstract from './Auth/AuthSingletone';
// import * as Misc from './Options/Misc';
// import * as MySQL from './Options/MySQL';

mp.events.addCommand({
    'pos' : (player) => { 
        const pos = player.position;
        let rot;
        if (player.vehicle) rot = player.vehicle.rotation.z
        else rot = player.heading;
        const str = `x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, rot: ${rot}, dim: ${player.dimension}`;
        player.outputChatBox(str);
    },
});
