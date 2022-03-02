// import * as fs from 'fs';
import DB from '../Options/sDB';

// const saveDirectory = "CustomCharacters";
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0;

// this will increase by 1 every time a player is sent to the character creator
let creatorDimension = 1;

// // making sure saveDirectory exists
// if (!fs.existsSync(saveDirectory)) {
//     fs.mkdirSync(saveDirectory);
// }

mp.events.add("playerJoin", (player) => {
    player.colorForOverlayIdx = function(index: number) {
        let color;

        switch (index) {
            case 1:
                color = this.customCharacter.BeardColor;
            break;

            case 2:
                color = this.customCharacter.EyebrowColor;
            break;

            case 5:
                color = this.customCharacter.BlushColor;
            break;

            case 8:
                color = this.customCharacter.LipstickColor;
            break;

            case 10:
                color = this.customCharacter.ChestHairColor;
            break;

            default:
                color = 0;
        }

        return color;
    };

    player.defaultCharacter = function() {
        this.customCharacter = {
            Gender: 0,

            Parents: {
                Father: 0,
                Mother: 0,
                Similarity: 1.0,
                SkinSimilarity: 1.0
            },

            Features: [],
            Appearance: [],

            Hair: {
                Hair: 0,
                Color: 0,
                HighlightColor: 0
            },

            EyebrowColor: 0,
            BeardColor: 0,
            EyeColor: 0,
            BlushColor: 0,
            LipstickColor: 0,
            ChestHairColor: 0
        };

        for (let i = 0; i < 20; i++) this.customCharacter.Features.push(0.0);
        for (let i = 0; i < 10; i++) this.customCharacter.Appearance.push({Value: 255, Opacity: 1.0});
        player.applyCharacter();
    };

    player.applyCharacter = function() {
        this.setCustomization(
            this.customCharacter.Gender == 0,

            this.customCharacter.Parents.Mother,
            this.customCharacter.Parents.Father,
            0,

            this.customCharacter.Parents.Mother,
            this.customCharacter.Parents.Father,
            0,

            this.customCharacter.Parents.Similarity,
            this.customCharacter.Parents.SkinSimilarity,
            0.0,

            this.customCharacter.EyeColor,
            this.customCharacter.Hair.Color,
            this.customCharacter.Hair.HighlightColor,

            this.customCharacter.Features
        );

        this.setClothes(2, this.customCharacter.Hair.Hair, 0, 2);
        for (let i = 0; i < 10; i++) this.setHeadOverlay(i, [this.customCharacter.Appearance[i].Value, this.customCharacter.Appearance[i].Opacity, this.colorForOverlayIdx(i), 0]);
    };

    player.loadCharacter = async function() {
        const result: any = await DB.query(`SELECT * FROM player_customization WHERE user_id = '${player.id_sql}'`);

        if (!result[0]) {
            this.defaultCharacter();
        } else {
            this.customCharacter.Gender = result[0].gender;
            this.customCharacter.Parents.Father = result[0].parents_father;
            this.customCharacter.Parents.Mother = result[0].parents_mother;
            this.customCharacter.Parents.Similarity = result[0].parents_similarity;
            this.customCharacter.Parents.SkinSimilarity = result[0].parents_skin_similarity;

            for (let i = 0; i < 20; ++i) {
                this.customCharacter.Features[i] = result[0][`features_${(i + 1).toString().padStart(2, "0")}`];
            }

            for (let i = 0; i < 11; ++i) {
                this.customCharacter.Appearance[i] = {
                    Value: result[0][`appearance_${(i + 1).toString().padStart(2, "0")}_value`],
                    Opacity: result[0][`appearance_${(i + 1).toString().padStart(2, "0")}_opacity`]
                };
            }

            // this.customCharacter.Features[0] = result[0].features_01;
            // this.customCharacter.Features[1] = result[0].features_02;
            // this.customCharacter.Features[2] = result[0].features_03;
            // this.customCharacter.Features[3] = result[0].features_04;
            // this.customCharacter.Features[4] = result[0].features_05;
            // this.customCharacter.Features[5] = result[0].features_06;
            // this.customCharacter.Features[6] = result[0].features_07;
            // this.customCharacter.Features[7] = result[0].features_08;
            // this.customCharacter.Features[8] = result[0].features_09;
            // this.customCharacter.Features[9] = result[0].features_10;
            // this.customCharacter.Features[10] = result[0].features_11;
            // this.customCharacter.Features[11] = result[0].features_12;
            // this.customCharacter.Features[12] = result[0].features_13;
            // this.customCharacter.Features[13] = result[0].features_14;
            // this.customCharacter.Features[14] = result[0].features_15;
            // this.customCharacter.Features[15] = result[0].features_16;
            // this.customCharacter.Features[16] = result[0].features_17;
            // this.customCharacter.Features[17] = result[0].features_18;
            // this.customCharacter.Features[18] = result[0].features_19;
            // this.customCharacter.Features[19] = result[0].features_20;

            // this.customCharacter.Appearance[0].Value = result[0].appearance_01_value;
            // this.customCharacter.Appearance[0].Opacity = result[0].appearance_01_opacity;
            // this.customCharacter.Appearance[1].Value = result[0].appearance_02_value;
            // this.customCharacter.Appearance[1].Opacity = result[0].appearance_02_opacity;
            // this.customCharacter.Appearance[2].Value = result[0].appearance_03_value;
            // this.customCharacter.Appearance[2].Opacity = result[0].appearance_03_opacity;
            // this.customCharacter.Appearance[3].Value = result[0].appearance_04_value;
            // this.customCharacter.Appearance[3].Opacity = result[0].appearance_04_opacity;
            // this.customCharacter.Appearance[4].Value = result[0].appearance_05_value;
            // this.customCharacter.Appearance[4].Opacity = result[0].appearance_05_opacity;
            // this.customCharacter.Appearance[5].Value = result[0].appearance_06_value;
            // this.customCharacter.Appearance[5].Opacity = result[0].appearance_06_opacity;
            // this.customCharacter.Appearance[6].Value = result[0].appearance_07_value;
            // this.customCharacter.Appearance[6].Opacity = result[0].appearance_07_opacity;
            // this.customCharacter.Appearance[7].Value = result[0].appearance_08_value;
            // this.customCharacter.Appearance[7].Opacity = result[0].appearance_08_opacity;
            // this.customCharacter.Appearance[8].Value = result[0].appearance_09_value;
            // this.customCharacter.Appearance[8].Opacity = result[0].appearance_09_opacity;
            // this.customCharacter.Appearance[9].Value = result[0].appearance_10_value;
            // this.customCharacter.Appearance[9].Opacity = result[0].appearance_10_opacity;
            // this.customCharacter.Appearance[10].Value = result[0].appearance_11_value;
            // this.customCharacter.Appearance[10].Opacity = result[0].appearance_11_opacity;

            this.customCharacter.Hair.Hair = result[0].hair_value;
            this.customCharacter.Hair.Color = result[0].hair_color;
            this.customCharacter.Hair.HighlightColor = result[0].hair_highlight_color;
            this.customCharacter.EyebrowColor = result[0].eyebrow_color;
            this.customCharacter.BeardColor = result[0].beard_color;
            this.customCharacter.EyeColor = result[0].eye_color;
            this.customCharacter.BlushColor = result[0].blush_color;
            this.customCharacter.LipstickColor = result[0].lipstick_color;
            this.customCharacter.ChestHairColor = result[0].chest_hair_color;

            // this.customCharacter = JSON.parse(data.toString());
            this.applyCharacter();
        }

        // fs.readFile(`${saveDirectory}/${this.name}.json`, (err: NodeJS.ErrnoException, data: Buffer) => {
        //     if (err) {
        //         if (err.code != "ENOENT") {
        //             console.log(`Couldn't read ${this.name}'s character. Reason: ${err.message}`);
        //         } else {
        //             this.defaultCharacter();
        //         }
        //     } else {
        //         this.customCharacter = JSON.parse(data.toString());
        //         this.applyCharacter();
        //     }
        // });
    };

    player.saveCharacter = async function() {
        await DB.query(
            "INSERT INTO `player_customization` (" +
                "`user_id`," +
                "`gender`," +
                "`parents_father`," +
                "`parents_mother`," +
                "`parents_similarity`," +
                "`parents_skin_similarity`," +
                "`features_01`," +
                "`features_02`," +
                "`features_03`," +
                "`features_04`," +
                "`features_05`," +
                "`features_06`," +
                "`features_07`," +
                "`features_08`," +
                "`features_09`," +
                "`features_10`," +
                "`features_11`," +
                "`features_12`," +
                "`features_13`," +
                "`features_14`," +
                "`features_15`," +
                "`features_16`," +
                "`features_17`," +
                "`features_18`," +
                "`features_19`," +
                "`features_20`," +
                "`appearance_01_value`," +
                "`appearance_01_opacity`," +
                "`appearance_02_value`," +
                "`appearance_02_opacity`," +
                "`appearance_03_value`," +
                "`appearance_03_opacity`," +
                "`appearance_04_value`," +
                "`appearance_04_opacity`," +
                "`appearance_05_value`," +
                "`appearance_05_opacity`," +
                "`appearance_06_value`," +
                "`appearance_06_opacity`," +
                "`appearance_07_value`," +
                "`appearance_07_opacity`," +
                "`appearance_08_value`," +
                "`appearance_08_opacity`," +
                "`appearance_09_value`," +
                "`appearance_09_opacity`," +
                "`appearance_10_value`," +
                "`appearance_10_opacity`," +
                "`appearance_11_value`," +
                "`appearance_11_opacity`," +
                "`hair_value`," +
                "`hair_color`," +
                "`hair_highlight_color`," +
                "`eyebrow_color`," +
                "`beard_color`," +
                "`eye_color`," +
                "`blush_color`," +
                "`lipstick_color`," +
                "`chest_hair_color`" +
            ") VALUES (" +
                `'${player.id_sql}',` +
                `'${player.customCharacter.Gender}',` +
                `'${player.customCharacter.Parents.Father}',` +
                `'${player.customCharacter.Parents.Mother}',` +
                `'${player.customCharacter.Parents.Similarity}',` +
                `'${player.customCharacter.Parents.SkinSimilarity}',` +
                `'${player.customCharacter.Features[0]}',` +
                `'${player.customCharacter.Features[1]}',` +
                `'${player.customCharacter.Features[2]}',` +
                `'${player.customCharacter.Features[3]}',` +
                `'${player.customCharacter.Features[4]}',` +
                `'${player.customCharacter.Features[5]}',` +
                `'${player.customCharacter.Features[6]}',` +
                `'${player.customCharacter.Features[7]}',` +
                `'${player.customCharacter.Features[8]}',` +
                `'${player.customCharacter.Features[9]}',` +
                `'${player.customCharacter.Features[10]}',` +
                `'${player.customCharacter.Features[11]}',` +
                `'${player.customCharacter.Features[12]}',` +
                `'${player.customCharacter.Features[13]}',` +
                `'${player.customCharacter.Features[14]}',` +
                `'${player.customCharacter.Features[15]}',` +
                `'${player.customCharacter.Features[16]}',` +
                `'${player.customCharacter.Features[17]}',` +
                `'${player.customCharacter.Features[18]}',` +
                `'${player.customCharacter.Features[19]}',` +
                `'${player.customCharacter.Appearance[0].Value}',` +
                `'${player.customCharacter.Appearance[0].Opacity}',` +
                `'${player.customCharacter.Appearance[1].Value}',` +
                `'${player.customCharacter.Appearance[1].Opacity}',` +
                `'${player.customCharacter.Appearance[2].Value}',` +
                `'${player.customCharacter.Appearance[2].Opacity}',` +
                `'${player.customCharacter.Appearance[3].Value}',` +
                `'${player.customCharacter.Appearance[3].Opacity}',` +
                `'${player.customCharacter.Appearance[4].Value}',` +
                `'${player.customCharacter.Appearance[4].Opacity}',` +
                `'${player.customCharacter.Appearance[5].Value}',` +
                `'${player.customCharacter.Appearance[5].Opacity}',` +
                `'${player.customCharacter.Appearance[6].Value}',` +
                `'${player.customCharacter.Appearance[6].Opacity}',` +
                `'${player.customCharacter.Appearance[7].Value}',` +
                `'${player.customCharacter.Appearance[7].Opacity}',` +
                `'${player.customCharacter.Appearance[8].Value}',` +
                `'${player.customCharacter.Appearance[8].Opacity}',` +
                `'${player.customCharacter.Appearance[9].Value}',` +
                `'${player.customCharacter.Appearance[9].Opacity}',` +
                `'${player.customCharacter.Appearance[10].Value}',` +
                `'${player.customCharacter.Appearance[10].Opacity}',` +
                `'${player.customCharacter.Hair.Hair}',` +
                `'${player.customCharacter.Hair.Color}',` +
                `'${player.customCharacter.Hair.HighlightColor}',` +
                `'${player.customCharacter.EyebrowColor}',` +
                `'${player.customCharacter.BeardColor}',` +
                `'${player.customCharacter.EyeColor}',` +
                `'${player.customCharacter.BlushColor}',` +
                `'${player.customCharacter.LipstickColor}',` +
                `'${player.customCharacter.ChestHairColor}'` +
            ");"
        );

        // fs.writeFile(`${saveDirectory}/${this.name}.json`, JSON.stringify(this.customCharacter, undefined, 4), (err) => {
        //     if (err) console.log(`Couldn't save ${this.name}'s character. Reason: ${err.message}`);
        // });
    };

    player.sendToCreator = function(): void {
        player.preCreatorPos = player.position;
        player.preCreatorHeading = player.heading;
        player.preCreatorDimension = player.dimension;

        player.position = creatorPlayerPos;
        player.heading = creatorPlayerHeading;
        player.dimension = creatorDimension;
        player.usingCreator = true;
        player.changedGender = false;
        player.call("toggleCreator", [true, JSON.stringify(player.customCharacter)]);

        creatorDimension++;
    };

    player.sendToWorld = function(): void {
        player.position = player.preCreatorPos;
        player.heading = player.preCreatorHeading;
        player.dimension = player.preCreatorDimension;
        player.usingCreator = false;
        player.changedGender = false;
        player.call("toggleCreator", [false]);
    };

    player.loadCharacter();
});

mp.events.add("creator_GenderChange", (player, gender) => {
    player.model = freemodeCharacters[gender];
    player.position = creatorPlayerPos;
    player.heading = creatorPlayerHeading;
    player.changedGender = true;
});

mp.events.add("creator_Save", (player, gender, parentData, featureData, appearanceData, hairAndColorData) => {
    player.customCharacter.Gender = gender;
    player.customCharacter.Parents = JSON.parse(parentData);
    player.customCharacter.Features = JSON.parse(featureData);
    player.customCharacter.Appearance = JSON.parse(appearanceData);

    let hairAndColors = JSON.parse(hairAndColorData);
    player.customCharacter.Hair = {Hair: hairAndColors[0], Color: hairAndColors[1], HighlightColor: hairAndColors[2]};
    player.customCharacter.EyebrowColor = hairAndColors[3];
    player.customCharacter.BeardColor = hairAndColors[4];
    player.customCharacter.EyeColor = hairAndColors[5];
    player.customCharacter.BlushColor = hairAndColors[6];
    player.customCharacter.LipstickColor = hairAndColors[7];
    player.customCharacter.ChestHairColor = hairAndColors[8];

    player.saveCharacter();
    player.applyCharacter();
    player.sendToWorld();
});

mp.events.add("creator_Leave", (player) => {
    if (player.changedGender) player.loadCharacter(); // revert back to last save if gender is changed
    player.applyCharacter();
    player.sendToWorld();
});

mp.events.add("CharCreator_LoadCharacter", (player) => {
    player.loadCharacter();
});

mp.events.addCommand("creator", (player) => {
    if (freemodeCharacters.indexOf(player.model) == -1) {
        player.outputChatBox("/creator command is restricted to freemode characters.");
    } else if (player.vehicle) {
        player.outputChatBox("You can't use this command inside a vehicle.");
    } else {
        if (player.usingCreator) {
            player.sendToWorld();
        } else {
            player.sendToCreator();
        }
    }
});
