/// <reference path="../index.d.ts" />

import Database from '../Database'
import { PlayerCustomization } from '../Database/entity/PlayerCustomization'

// const saveDirectory = "CustomCharacters";
const freemodeCharacters = [mp.joaat('mp_m_freemode_01'), mp.joaat('mp_f_freemode_01')]
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027)
const creatorPlayerHeading = -185.0

// this will increase by 1 every time a player is sent to the character creator
let creatorDimension = 1

// // making sure saveDirectory exists
// if (!fs.existsSync(saveDirectory)) {
//     fs.mkdirSync(saveDirectory);
// }

mp.events.add('playerJoin', (player) => {
  player.colorForOverlayIdx = function (index: number) {
    let color

    switch (index) {
      case 1:
        color = this.customCharacter.BeardColor
        break

      case 2:
        color = this.customCharacter.EyebrowColor
        break

      case 5:
        color = this.customCharacter.BlushColor
        break

      case 8:
        color = this.customCharacter.LipstickColor
        break

      case 10:
        color = this.customCharacter.ChestHairColor
        break

      default:
        color = 0
    }

    return color
  }

  player.defaultCharacter = function () {
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
    }

    for (let i = 0; i < 20; i++) this.customCharacter.Features.push(0.0)
    for (let i = 0; i < 10; i++) this.customCharacter.Appearance.push({ Value: 255, Opacity: 1.0 })
    player.applyCharacter()
  }

  player.applyCharacter = function () {
    this.setCustomization(
      this.customCharacter.Gender === 0,

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
    )

    this.setClothes(2, this.customCharacter.Hair.Hair, 0, 2)
    for (let i = 0; i < 10; i++) this.setHeadOverlay(i, [this.customCharacter.Appearance[i].Value, this.customCharacter.Appearance[i].Opacity, this.colorForOverlayIdx(i), 0])
  }

  player.loadCharacter = async function () {
    const playerCustomization: PlayerCustomization | null = await Database.getPlayerCustomizationById(player.user_id)

    if (playerCustomization === null) {
      this.defaultCharacter()
      return
    }

    this.customCharacter.Gender = playerCustomization.gender
    this.customCharacter.Parents.Father = playerCustomization.parents_father
    this.customCharacter.Parents.Mother = playerCustomization.parents_mother
    this.customCharacter.Parents.Similarity = playerCustomization.parents_similarity
    this.customCharacter.Parents.SkinSimilarity = playerCustomization.parents_skin_similarity

    for (let i = 0; i < 20; ++i) {
      this.customCharacter.Features[i] = playerCustomization[`features_${(i + 1).toString().padStart(2, '0')}`]
    }

    for (let i = 0; i < 11; ++i) {
      this.customCharacter.Appearance[i] = {
        Value: playerCustomization[`appearance_${(i + 1).toString().padStart(2, '0')}_value`],
        Opacity: playerCustomization[`appearance_${(i + 1).toString().padStart(2, '0')}_opacity`]
      }
    }

    // this.customCharacter.Features[0] = playerCustomization.features_01;
    // this.customCharacter.Features[1] = playerCustomization.features_02;
    // this.customCharacter.Features[2] = playerCustomization.features_03;
    // this.customCharacter.Features[3] = playerCustomization.features_04;
    // this.customCharacter.Features[4] = playerCustomization.features_05;
    // this.customCharacter.Features[5] = playerCustomization.features_06;
    // this.customCharacter.Features[6] = playerCustomization.features_07;
    // this.customCharacter.Features[7] = playerCustomization.features_08;
    // this.customCharacter.Features[8] = playerCustomization.features_09;
    // this.customCharacter.Features[9] = playerCustomization.features_10;
    // this.customCharacter.Features[10] = playerCustomization.features_11;
    // this.customCharacter.Features[11] = playerCustomization.features_12;
    // this.customCharacter.Features[12] = playerCustomization.features_13;
    // this.customCharacter.Features[13] = playerCustomization.features_14;
    // this.customCharacter.Features[14] = playerCustomization.features_15;
    // this.customCharacter.Features[15] = playerCustomization.features_16;
    // this.customCharacter.Features[16] = playerCustomization.features_17;
    // this.customCharacter.Features[17] = playerCustomization.features_18;
    // this.customCharacter.Features[18] = playerCustomization.features_19;
    // this.customCharacter.Features[19] = playerCustomization.features_20;

    // this.customCharacter.Appearance[0].Value = playerCustomization.appearance_01_value;
    // this.customCharacter.Appearance[0].Opacity = playerCustomization.appearance_01_opacity;
    // this.customCharacter.Appearance[1].Value = playerCustomization.appearance_02_value;
    // this.customCharacter.Appearance[1].Opacity = playerCustomization.appearance_02_opacity;
    // this.customCharacter.Appearance[2].Value = playerCustomization.appearance_03_value;
    // this.customCharacter.Appearance[2].Opacity = playerCustomization.appearance_03_opacity;
    // this.customCharacter.Appearance[3].Value = playerCustomization.appearance_04_value;
    // this.customCharacter.Appearance[3].Opacity = playerCustomization.appearance_04_opacity;
    // this.customCharacter.Appearance[4].Value = playerCustomization.appearance_05_value;
    // this.customCharacter.Appearance[4].Opacity = playerCustomization.appearance_05_opacity;
    // this.customCharacter.Appearance[5].Value = playerCustomization.appearance_06_value;
    // this.customCharacter.Appearance[5].Opacity = playerCustomization.appearance_06_opacity;
    // this.customCharacter.Appearance[6].Value = playerCustomization.appearance_07_value;
    // this.customCharacter.Appearance[6].Opacity = playerCustomization.appearance_07_opacity;
    // this.customCharacter.Appearance[7].Value = playerCustomization.appearance_08_value;
    // this.customCharacter.Appearance[7].Opacity = playerCustomization.appearance_08_opacity;
    // this.customCharacter.Appearance[8].Value = playerCustomization.appearance_09_value;
    // this.customCharacter.Appearance[8].Opacity = playerCustomization.appearance_09_opacity;
    // this.customCharacter.Appearance[9].Value = playerCustomization.appearance_10_value;
    // this.customCharacter.Appearance[9].Opacity = playerCustomization.appearance_10_opacity;
    // this.customCharacter.Appearance[10].Value = playerCustomization.appearance_11_value;
    // this.customCharacter.Appearance[10].Opacity = playerCustomization.appearance_11_opacity;

    this.customCharacter.Hair.Hair = playerCustomization.hair_value
    this.customCharacter.Hair.Color = playerCustomization.hair_color
    this.customCharacter.Hair.HighlightColor = playerCustomization.hair_highlight_color
    this.customCharacter.EyebrowColor = playerCustomization.eyebrow_color
    this.customCharacter.BeardColor = playerCustomization.beard_color
    this.customCharacter.EyeColor = playerCustomization.eye_color
    this.customCharacter.BlushColor = playerCustomization.blush_color
    this.customCharacter.LipstickColor = playerCustomization.lipstick_color
    this.customCharacter.ChestHairColor = playerCustomization.chest_hair_color

    // this.customCharacter = JSON.parse(data.toString());
    this.applyCharacter()

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
  }

  player.saveCharacter = async function () {
    await Database.removePlayerCustomizationById(player.id_sql)

    const playerCustomization = new PlayerCustomization()
    playerCustomization.player_id = player.id_sql
    playerCustomization.gender = player.customCharacter.Gender
    playerCustomization.parents_father = player.customCharacter.Parents.Father
    playerCustomization.parents_mother = player.customCharacter.Parents.Mother
    playerCustomization.parents_similarity = player.customCharacter.Parents.Similarity
    playerCustomization.parents_skin_similarity = player.customCharacter.Parents.SkinSimilarity
    playerCustomization.features_01 = player.customCharacter.Features[0]
    playerCustomization.features_02 = player.customCharacter.Features[1]
    playerCustomization.features_03 = player.customCharacter.Features[2]
    playerCustomization.features_04 = player.customCharacter.Features[3]
    playerCustomization.features_05 = player.customCharacter.Features[4]
    playerCustomization.features_06 = player.customCharacter.Features[5]
    playerCustomization.features_07 = player.customCharacter.Features[6]
    playerCustomization.features_08 = player.customCharacter.Features[7]
    playerCustomization.features_09 = player.customCharacter.Features[8]
    playerCustomization.features_10 = player.customCharacter.Features[9]
    playerCustomization.features_11 = player.customCharacter.Features[10]
    playerCustomization.features_12 = player.customCharacter.Features[11]
    playerCustomization.features_13 = player.customCharacter.Features[12]
    playerCustomization.features_14 = player.customCharacter.Features[13]
    playerCustomization.features_15 = player.customCharacter.Features[14]
    playerCustomization.features_16 = player.customCharacter.Features[15]
    playerCustomization.features_17 = player.customCharacter.Features[16]
    playerCustomization.features_18 = player.customCharacter.Features[17]
    playerCustomization.features_19 = player.customCharacter.Features[18]
    playerCustomization.features_20 = player.customCharacter.Features[19]
    playerCustomization.appearance_01_value = player.customCharacter.Appearance[0].Value
    playerCustomization.appearance_01_opacity = player.customCharacter.Appearance[0].Opacity
    playerCustomization.appearance_02_value = player.customCharacter.Appearance[1].Value
    playerCustomization.appearance_02_opacity = player.customCharacter.Appearance[1].Opacity
    playerCustomization.appearance_03_value = player.customCharacter.Appearance[2].Value
    playerCustomization.appearance_03_opacity = player.customCharacter.Appearance[2].Opacity
    playerCustomization.appearance_04_value = player.customCharacter.Appearance[3].Value
    playerCustomization.appearance_04_opacity = player.customCharacter.Appearance[3].Opacity
    playerCustomization.appearance_05_value = player.customCharacter.Appearance[4].Value
    playerCustomization.appearance_05_opacity = player.customCharacter.Appearance[4].Opacity
    playerCustomization.appearance_06_value = player.customCharacter.Appearance[5].Value
    playerCustomization.appearance_06_opacity = player.customCharacter.Appearance[5].Opacity
    playerCustomization.appearance_07_value = player.customCharacter.Appearance[6].Value
    playerCustomization.appearance_07_opacity = player.customCharacter.Appearance[6].Opacity
    playerCustomization.appearance_08_value = player.customCharacter.Appearance[7].Value
    playerCustomization.appearance_08_opacity = player.customCharacter.Appearance[7].Opacity
    playerCustomization.appearance_09_value = player.customCharacter.Appearance[8].Value
    playerCustomization.appearance_09_opacity = player.customCharacter.Appearance[8].Opacity
    playerCustomization.appearance_10_value = player.customCharacter.Appearance[9].Value
    playerCustomization.appearance_10_opacity = player.customCharacter.Appearance[9].Opacity
    playerCustomization.appearance_11_value = player.customCharacter.Appearance[10].Value
    playerCustomization.appearance_11_opacity = player.customCharacter.Appearance[10].Opacity
    playerCustomization.hair_value = player.customCharacter.Hair.Hair
    playerCustomization.hair_color = player.customCharacter.Hair.Color
    playerCustomization.hair_highlight_color = player.customCharacter.Hair.HighlightColor
    playerCustomization.eyebrow_color = player.customCharacter.EyebrowColor
    playerCustomization.beard_color = player.customCharacter.BeardColor
    playerCustomization.eye_color = player.customCharacter.EyeColor
    playerCustomization.blush_color = player.customCharacter.BlushColor
    playerCustomization.lipstick_color = player.customCharacter.LipstickColor
    playerCustomization.chest_hair_color = player.customCharacter.ChestHairColor
    await Database.savePlayerCustomization(playerCustomization)
  }

  player.sendToCreator = function (): void {
    player.preCreatorPos = player.position
    player.preCreatorHeading = player.heading
    player.preCreatorDimension = player.dimension

    player.position = creatorPlayerPos
    player.heading = creatorPlayerHeading
    player.dimension = creatorDimension
    player.usingCreator = true
    player.changedGender = false
    player.call('toggleCreator', [true, JSON.stringify(player.customCharacter)])

    creatorDimension++
  }

  player.sendToWorld = function (): void {
    player.position = player.preCreatorPos
    player.heading = player.preCreatorHeading
    player.dimension = player.preCreatorDimension
    player.usingCreator = false
    player.changedGender = false
    player.call('toggleCreator', [false])
  }

  player.defaultCharacter()
  // player.loadCharacter();
})

mp.events.add('creator_GenderChange', (player, gender) => {
  player.model = freemodeCharacters[gender]
  player.position = creatorPlayerPos
  player.heading = creatorPlayerHeading
  player.changedGender = true
})

mp.events.add('creator_Save', (player, gender, parentData, featureData, appearanceData, hairAndColorData) => {
  player.customCharacter.Gender = gender
  player.customCharacter.Parents = JSON.parse(parentData)
  player.customCharacter.Features = JSON.parse(featureData)
  player.customCharacter.Appearance = JSON.parse(appearanceData)

  const hairAndColors = JSON.parse(hairAndColorData)
  player.customCharacter.Hair = { Hair: hairAndColors[0], Color: hairAndColors[1], HighlightColor: hairAndColors[2] }
  player.customCharacter.EyebrowColor = hairAndColors[3]
  player.customCharacter.BeardColor = hairAndColors[4]
  player.customCharacter.EyeColor = hairAndColors[5]
  player.customCharacter.BlushColor = hairAndColors[6]
  player.customCharacter.LipstickColor = hairAndColors[7]
  player.customCharacter.ChestHairColor = hairAndColors[8]

  player.saveCharacter()
  player.applyCharacter()
  player.sendToWorld()
})

mp.events.add('creator_Leave', (player) => {
  if (player.changedGender) player.loadCharacter() // revert back to last save if gender is changed
  player.applyCharacter()
  player.sendToWorld()
})

mp.events.add('CharCreator_LoadCharacter', (player) => {
  player.loadCharacter()
})

mp.events.addCommand('creator', (player) => {
  if (!freemodeCharacters.includes(player.model)) {
    player.outputChatBox('/creator command is restricted to freemode characters.')
  } else if (player.vehicle) {
    player.outputChatBox("You can't use this command inside a vehicle.")
  } else {
    if (player.usingCreator) {
      player.sendToWorld()
    } else {
      player.sendToCreator()
    }
  }
})
