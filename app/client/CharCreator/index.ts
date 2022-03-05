// const Data = require("./data");
import Data from "./data"
// const NativeUI = require('../vendor/nativeui');
import * as NativeUI from '../vendor/nativeui';

class CharCreator {

    private localPlayer = mp.players.local;
    private currentGender = 0;
    private creatorMenus = [];
    private creatorCamera;
    private creatorFeaturesMenu;
    private creatorAppearanceMenu;

    // CREATOR HAIR & COLORS
    private hairItem;
    private hairColorItem;
    private hairHighlightItem;
    private eyebrowColorItem;
    private beardColorItem;
    private eyeColorItem;
    private blushColorItem;
    private lipstickColorItem;
    private chestHairColorItem;

    // CREATOR APPEARANCE
    private appearanceItems = [];
    private appearanceOpacityItems = [];
    private opacities = [];

    // CREATOR FEATURES
    private featureItems = [];
    private features = [];

    // CREATOR PARENTS
    private similarities = [];

    private creatorParentsMenu;
    private fatherItem;
    private motherItem;
    private similarityItem;
    private skinSimilarityItem;
    private creatorHairMenu;

    // color arrays
    private hairColors = [];
    private blushColors = [];
    private lipstickColors = [];

    constructor() {
        const creatorCoords = {
            camera: new mp.Vector3(402.8664, -997.5515, -98.5),
            cameraLookAt: new mp.Vector3(402.8664, -996.4108, -98.5)
        };

        // const this.localPlayer = mp.players.local;
        // this.localPlayer = mp.players.local;

        // let this.currentGender = 0;
        // let this.creatorMenus = [];
        // let this.creatorCamera;

        // color arrays
        // let this.hairColors = [];
        for (let i = 0; i < Data.maxHairColor; i++) this.hairColors.push(i.toString());

        // let this.blushColors = [];
        for (let i = 0; i < Data.maxBlushColor; i++) this.blushColors.push(i.toString());

        // let this.lipstickColors = [];
        for (let i = 0; i < Data.maxLipstickColor; i++) this.lipstickColors.push(i.toString());

        // CREATOR MAIN
        let creatorMainMenu = new NativeUI.Menu("Creator", "", new NativeUI.Point(50, 50));
        let genderItem = new NativeUI.UIMenuListItem("Gender", "~r~Changing this will reset your customization.", new NativeUI.ItemsCollection(["Male", "Female"]));
        creatorMainMenu.AddItem(genderItem);
        creatorMainMenu.AddItem(new NativeUI.UIMenuItem("Parents", "Your character's parents."));
        creatorMainMenu.AddItem(new NativeUI.UIMenuItem("Features", "Your character's facial this.features."));
        creatorMainMenu.AddItem(new NativeUI.UIMenuItem("Appearance", "Your character's appearance."));
        creatorMainMenu.AddItem(new NativeUI.UIMenuItem("Hair & Colors", "Your character's hair and hair colors."));

        let angles = [];
        for (let i = -180.0; i <= 180.0; i += 5.0) angles.push(i.toFixed(1));
        let angleItem = new NativeUI.UIMenuListItem("Angle", "", new NativeUI.ItemsCollection(angles));
        creatorMainMenu.AddItem(angleItem);

        let saveItem = new NativeUI.UIMenuItem("Save", "Save all changes.");
        saveItem.BackColor = new NativeUI.Color(13, 71, 161);
        saveItem.HighlightedBackColor = new NativeUI.Color(25, 118, 210);
        creatorMainMenu.AddItem(saveItem);

        let cancelItem = new NativeUI.UIMenuItem("Cancel", "Discard all changes.");
        cancelItem.BackColor = new NativeUI.Color(213, 0, 0);
        cancelItem.HighlightedBackColor = new NativeUI.Color(229, 57, 53);
        creatorMainMenu.AddItem(cancelItem);

        creatorMainMenu.ListChange.on((item, listIndex) => {
            if (item == genderItem) {
                this.currentGender = listIndex;
                mp.events.callRemote("creator_GenderChange", listIndex);

                setTimeout(() => {
                    this.localPlayer.clearTasksImmediately();
                    this.applyCreatorOutfit();
                    angleItem.Index = 0;
                    this.resetParentsMenu(true);
                    this.resetFeaturesMenu(true);
                    this.resetAppearanceMenu(true);

                    this.creatorHairMenu.Clear();
                    this.fillHairMenu();
                    this.creatorHairMenu.RefreshIndex();
                }, 200);
            } else if (item == angleItem) {
                this.localPlayer.setHeading(parseFloat(angleItem.SelectedValue));
                this.localPlayer.clearTasksImmediately();
            }
        });

        creatorMainMenu.ItemSelect.on((item, index) => {
            switch (index) {
                case 1:
                    creatorMainMenu.Visible = false;
                    this.creatorParentsMenu.Visible = true;
                break;

                case 2:
                    creatorMainMenu.Visible = false;
                    this.creatorFeaturesMenu.Visible = true;
                break;

                case 3:
                    creatorMainMenu.Visible = false;
                    this.creatorAppearanceMenu.Visible = true;
                break;

                case 4:
                    creatorMainMenu.Visible = false;
                    this.creatorHairMenu.Visible = true;
                break;

                case 6:
                    let parentData = {
                        Father: Data.fathers[this.fatherItem.Index],
                        Mother: Data.mothers[this.motherItem.Index],
                        Similarity: this.similarityItem.Index * 0.01,
                        SkinSimilarity: this.skinSimilarityItem.Index * 0.01
                    };

                    let featureData = [];
                    for (let i = 0; i < this.featureItems.length; i++) featureData.push(parseFloat(this.featureItems[i].SelectedValue));

                    let appearanceData = [];
                    for (let i = 0; i < this.appearanceItems.length; i++) appearanceData.push({Value: ((this.appearanceItems[i].Index == 0) ? 255 : this.appearanceItems[i].Index - 1), Opacity: this.appearanceOpacityItems[i].Index * 0.01});

                    let hairAndColors = [
                        Data.hairList[this.currentGender][this.hairItem.Index].ID,
                        this.hairColorItem.Index,
                        this.hairHighlightItem.Index,
                        this.eyebrowColorItem.Index,
                        this.beardColorItem.Index,
                        this.eyeColorItem.Index,
                        this.blushColorItem.Index,
                        this.lipstickColorItem.Index,
                        this.chestHairColorItem.Index
                    ];

                    mp.events.callRemote("creator_Save", this.currentGender, JSON.stringify(parentData), JSON.stringify(featureData), JSON.stringify(appearanceData), JSON.stringify(hairAndColors));
                break;

                case 7:
                    mp.events.callRemote("creator_Leave");
                break;
            }
        });

        creatorMainMenu.MenuClose.on(() => {
            mp.events.callRemote("creator_Leave");
        });

        creatorMainMenu.Visible = false;
        this.creatorMenus.push(creatorMainMenu);
        // CREATOR MAIN END

        // CREATOR PARENTS
        // let this.similarities = [];
        for (let i = 0; i <= 100; i++) this.similarities.push(i + "%");

        this.creatorParentsMenu = new NativeUI.Menu("Parents", "", new NativeUI.Point(50, 50));
        this.fatherItem = new NativeUI.UIMenuListItem("Father", "Your character's father.", new NativeUI.ItemsCollection(Data.fatherNames));
        this.motherItem = new NativeUI.UIMenuListItem("Mother", "Your character's mother.", new NativeUI.ItemsCollection(Data.motherNames));
        this.similarityItem = new NativeUI.UIMenuListItem("Resemblance", "Similarity to parents.\n(lower = feminine, higher = masculine)", new NativeUI.ItemsCollection(this.similarities));
        this.skinSimilarityItem = new NativeUI.UIMenuListItem("Skin Tone", "Skin color similarity to parents.\n(lower = mother's, higher = father's)", new NativeUI.ItemsCollection(this.similarities));
        this.creatorParentsMenu.AddItem(this.fatherItem);
        this.creatorParentsMenu.AddItem(this.motherItem);
        this.creatorParentsMenu.AddItem(this.similarityItem);
        this.creatorParentsMenu.AddItem(this.skinSimilarityItem);
        this.creatorParentsMenu.AddItem(new NativeUI.UIMenuItem("Randomize", "~r~Randomizes your parents."));
        this.creatorParentsMenu.AddItem(new NativeUI.UIMenuItem("Reset", "~r~Resets your parents."));

        this.creatorParentsMenu.ItemSelect.on((item, index) => {
            switch (item.Text) {
                case "Randomize":
                    this.fatherItem.Index = this.getRandomInt(0, Data.fathers.length - 1);
                    this.motherItem.Index = this.getRandomInt(0, Data.mothers.length - 1);
                    this.similarityItem.Index = this.getRandomInt(0, 100);
                    this.skinSimilarityItem.Index = this.getRandomInt(0, 100);
                    this.updateParents();
                break;

                case "Reset":
                    this.resetParentsMenu();
                break;
            }
        });

        this.creatorParentsMenu.ListChange.on((item, listIndex) => {
            this.updateParents();
        });

        this.creatorParentsMenu.ParentMenu = creatorMainMenu;
        this.creatorParentsMenu.Visible = false;
        this.creatorMenus.push(this.creatorParentsMenu);
        // CREATOR PARENTS END

        // // CREATOR FEATURES
        // let this.featureItems = [];
        // let this.features = [];
        for (let i = -1.0; i <= 1.01; i += 0.01) this.features.push(i.toFixed(2));

        this.creatorFeaturesMenu = new NativeUI.Menu("Features", "", new NativeUI.Point(50, 50));

        for (let i = 0; i < Data.featureNames.length; i++) {
            let tempFeatureItem = new NativeUI.UIMenuListItem(Data.featureNames[i], "", new NativeUI.ItemsCollection(this.features));
            tempFeatureItem.Index = 100;
            this.featureItems.push(tempFeatureItem);
            this.creatorFeaturesMenu.AddItem(tempFeatureItem);
        }

        this.creatorFeaturesMenu.AddItem(new NativeUI.UIMenuItem("Randomize", "~r~Randomizes your this.features."));
        this.creatorFeaturesMenu.AddItem(new NativeUI.UIMenuItem("Reset", "~r~Resets your this.features."));

        this.creatorFeaturesMenu.ItemSelect.on((item, index) => {
            switch (item.Text) {
                case "Randomize":
                    for (let i = 0; i < Data.featureNames.length; i++) {
                        this.featureItems[i].Index = this.getRandomInt(0, 200);
                        this.updateFaceFeature(i);
                    }
                break;

                case "Reset":
                    this.resetFeaturesMenu();
                break;
            }
        });

        this.creatorFeaturesMenu.ListChange.on((item, listIndex) => {
            this.updateFaceFeature(this.featureItems.indexOf(item));
        });

        this.creatorFeaturesMenu.ParentMenu = creatorMainMenu;
        this.creatorFeaturesMenu.Visible = false;
        this.creatorMenus.push(this.creatorFeaturesMenu);
        // CREATOR FEATURES END

        // // CREATOR APPEARANCE
        // let this.appearanceItems = [];
        // let this.appearanceOpacityItems = [];
        // let this.opacities = [];
        for (let i = 0; i <= 100; i++) this.opacities.push(i + "%");

        this.creatorAppearanceMenu = new NativeUI.Menu("Appearance", "", new NativeUI.Point(50, 50));

        for (let i = 0; i < Data.appearanceNames.length; i++) {
            let items = [];
            for (let j = 0, max = mp.game.ped.getNumHeadOverlayValues(i); j <= max; j++) items.push((Data.appearanceItemNames[i][j] === undefined) ? j.toString() : Data.appearanceItemNames[i][j]);

            let tempAppearanceItem = new NativeUI.UIMenuListItem(Data.appearanceNames[i], "", new NativeUI.ItemsCollection(items));
            this.appearanceItems.push(tempAppearanceItem);
            this.creatorAppearanceMenu.AddItem(tempAppearanceItem);

            let tempAppearanceOpacityItem = new NativeUI.UIMenuListItem(Data.appearanceNames[i] + " Opacity", "", new NativeUI.ItemsCollection(this.opacities));
            tempAppearanceOpacityItem.Index = 100;
            this.appearanceOpacityItems.push(tempAppearanceOpacityItem);
            this.creatorAppearanceMenu.AddItem(tempAppearanceOpacityItem);
        }

        this.creatorAppearanceMenu.AddItem(new NativeUI.UIMenuItem("Randomize", "~r~Randomizes your appearance."));
        this.creatorAppearanceMenu.AddItem(new NativeUI.UIMenuItem("Reset", "~r~Resets your appearance."));

        this.creatorAppearanceMenu.ItemSelect.on((item, index) => {
            switch (item.Text) {
                case "Randomize":
                    for (let i = 0; i < Data.appearanceNames.length; i++) {
                        this.appearanceItems[i].Index = this.getRandomInt(0, mp.game.ped.getNumHeadOverlayValues(i) - 1);
                        this.appearanceOpacityItems[i].Index = this.getRandomInt(0, 100);
                        this.updateAppearance(i);
                    }
                break;

                case "Reset":
                    this.resetAppearanceMenu();
                break;
            }
        });

        this.creatorAppearanceMenu.ListChange.on((item, listIndex) => {
            let idx = (this.creatorAppearanceMenu.CurrentSelection % 2 == 0) ? (this.creatorAppearanceMenu.CurrentSelection / 2) : Math.floor(this.creatorAppearanceMenu.CurrentSelection / 2);
            this.updateAppearance(idx);
        });

        this.creatorAppearanceMenu.ParentMenu = creatorMainMenu;
        this.creatorAppearanceMenu.Visible = false;
        this.creatorMenus.push(this.creatorAppearanceMenu);
        // CREATOR APPEARANCE END

        // CREATOR HAIR & COLORS
        // let this.hairItem;
        // let this.hairColorItem;
        // let this.hairHighlightItem;
        // let this.eyebrowColorItem;
        // let this.beardColorItem;
        // let this.eyeColorItem;
        // let this.blushColorItem;
        // let this.lipstickColorItem;
        // let this.chestHairColorItem;

        this.creatorHairMenu = new NativeUI.Menu("Hair & Colors", "", new NativeUI.Point(50, 50));
        this.fillHairMenu();

        this.creatorHairMenu.ItemSelect.on((item, index) => {
            switch (item.Text) {
                case "Randomize":
                    this.hairItem.Index = this.getRandomInt(0, Data.hairList[this.currentGender].length - 1);
                    this.hairColorItem.Index = this.getRandomInt(0, Data.maxHairColor);
                    this.hairHighlightItem.Index = this.getRandomInt(0, Data.maxHairColor);
                    this.eyebrowColorItem.Index = this.getRandomInt(0, Data.maxHairColor);
                    this.beardColorItem.Index = this.getRandomInt(0, Data.maxHairColor);
                    this.eyeColorItem.Index = this.getRandomInt(0, Data.maxEyeColor);
                    this.blushColorItem.Index = this.getRandomInt(0, Data.maxBlushColor);
                    this.lipstickColorItem.Index = this.getRandomInt(0, Data.maxLipstickColor);
                    this.chestHairColorItem.Index = this.getRandomInt(0, Data.maxHairColor);
                    this.updateHairAndColors();
                break;

                case "Reset":
                    this.resetHairAndColorsMenu();
                break;
            }
        });

        this.creatorHairMenu.ListChange.on((item, listIndex) => {
            if (item == this.hairItem) {
                let hairStyle = Data.hairList[this.currentGender][listIndex];
                this.localPlayer.setComponentVariation(2, hairStyle.ID, 0, 2);
            } else {
                switch (this.creatorHairMenu.CurrentSelection) {
                    case 1: // hair color
                        this.localPlayer.setHairColor(listIndex, this.hairHighlightItem.Index);
                    break;

                    case 2: // hair highlight color
                        this.localPlayer.setHairColor(this.hairColorItem.Index, listIndex);
                    break;

                    case 3: // eyebrow color
                        this.localPlayer.setHeadOverlayColor(2, 1, listIndex, 0);
                    break;

                    case 4: // facial hair color
                        this.localPlayer.setHeadOverlayColor(1, 1, listIndex, 0);
                    break;

                    case 5: // eye color
                        this.localPlayer.setEyeColor(listIndex);
                    break;

                    case 6: // blush color
                        this.localPlayer.setHeadOverlayColor(5, 2, listIndex, 0);
                    break;

                    case 7: // lipstick color
                        this.localPlayer.setHeadOverlayColor(8, 2, listIndex, 0);
                    break;

                    case 8: // chest hair color
                        this.localPlayer.setHeadOverlayColor(10, 1, listIndex, 0);
                    break;
                }
            }
        });

        this.creatorHairMenu.ParentMenu = creatorMainMenu;
        this.creatorHairMenu.Visible = false;
        this.creatorMenus.push(this.creatorHairMenu);
        // CREATOR HAIR & COLORS END

        // EVENTS
        mp.events.add("toggleCreator", (active, charData) => {
            if (active) {
                if (this.creatorCamera === undefined) {
                    this.creatorCamera = mp.cameras.new("this.creatorCamera", creatorCoords.camera, new mp.Vector3(0, 0, 0), 45);
                    this.creatorCamera.pointAtCoord(creatorCoords.cameraLookAt.x, creatorCoords.cameraLookAt.y, creatorCoords.cameraLookAt.z);
                    this.creatorCamera.setActive(true);
                }

                // update menus with current character data
                if (charData) {
                    charData = JSON.parse(charData);

                    // gender
                    this.currentGender = charData.Gender;
                    genderItem.Index = charData.Gender;

                    this.creatorHairMenu.Clear();
                    this.fillHairMenu();
                    this.applyCreatorOutfit();

                    // parents
                    this.fatherItem.Index = Data.fathers.indexOf(charData.Parents.Father);
                    this.motherItem.Index = Data.mothers.indexOf(charData.Parents.Mother);
                    // this.similarityItem.Index = parseInt(charData.Parents.Similarity * 100);
                    // this.skinSimilarityItem.Index = parseInt(charData.Parents.SkinSimilarity * 100);
                    this.similarityItem.Index = (charData.Parents.Similarity * 100);
                    this.skinSimilarityItem.Index = (charData.Parents.SkinSimilarity * 100);
                    this.updateParents();

                    // this.features
                    for (let i = 0; i < charData.Features.length; i++) {
                        this.featureItems[i].Index = (charData.Features[i] * 100) + 100;
                        this.updateFaceFeature(i);
                    }

                    // hair and colors
                    let hair = Data.hairList[this.currentGender].find(h => h.ID == charData.Hair.Hair);
                    this.hairItem.Index = Data.hairList[this.currentGender].indexOf(hair);

                    this.hairColorItem.Index = charData.Hair.Color;
                    this.hairHighlightItem.Index = charData.Hair.HighlightColor;
                    this.eyebrowColorItem.Index = charData.EyebrowColor;
                    this.beardColorItem.Index = charData.BeardColor;
                    this.eyeColorItem.Index = charData.EyeColor;
                    this.blushColorItem.Index = charData.BlushColor;
                    this.lipstickColorItem.Index = charData.LipstickColor;
                    this.chestHairColorItem.Index = charData.ChestHairColor;
                    this.updateHairAndColors();

                    // appearance
                    for (let i = 0; i < charData.Appearance.length; i++) {
                        this.appearanceItems[i].Index = (charData.Appearance[i].Value == 255) ? 0 : charData.Appearance[i].Value + 1;
                        this.appearanceOpacityItems[i].Index = charData.Appearance[i].Opacity * 100;
                        this.updateAppearance(i);
                    }
                }

                creatorMainMenu.Visible = true;
                mp.gui.chat.show(false);
                mp.game.ui.displayRadar(false);
                mp.game.ui.displayHud(false);
                this.localPlayer.clearTasksImmediately();
                this.localPlayer.freezePosition(true);

                mp.game.cam.renderScriptCams(true, false, 0, true, false);
            } else {
                for (let i = 0; i < this.creatorMenus.length; i++) this.creatorMenus[i].Visible = false;
                mp.gui.chat.show(true);
                mp.game.ui.displayRadar(true);
                mp.game.ui.displayHud(true);
                this.localPlayer.freezePosition(false);
                this.localPlayer.setDefaultComponentVariation();
                this.localPlayer.setComponentVariation(2, Data.hairList[this.currentGender][this.hairItem.Index].ID, 0, 2);
                mp.events.callRemote("ClothesMenu_Reload");

                mp.game.cam.renderScriptCams(false, false, 0, true, false);
            }
        });
    }

    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private colorForOverlayIdx(index) {
        let color;

        switch (index) {
            case 1:
                color = this.beardColorItem.Index;
            break;

            case 2:
                color = this.eyebrowColorItem.Index;
            break;

            case 5:
                color = this.blushColorItem.Index;
            break;

            case 8:
                color = this.lipstickColorItem.Index;
            break;

            case 10:
                color = this.chestHairColorItem.Index;
            break;

            default:
                color = 0;
        }

        return color;
    }

    private updateParents() {
        this.localPlayer.setHeadBlendData(
            // shape
            Data.mothers[this.motherItem.Index],
            Data.fathers[this.fatherItem.Index],
            0,

            // skin
            Data.mothers[this.motherItem.Index],
            Data.fathers[this.fatherItem.Index],
            0,

            // mixes
            this.similarityItem.Index * 0.01,
            this.skinSimilarityItem.Index * 0.01,
            0.0,

            false
        );
    }

    private updateFaceFeature(index) {
        this.localPlayer.setFaceFeature(index, parseFloat(this.featureItems[index].SelectedValue));
    }

    private updateAppearance(index) {
        let overlayID = (this.appearanceItems[index].Index == 0) ? 255 : this.appearanceItems[index].Index - 1;
        this.localPlayer.setHeadOverlay(index, overlayID, this.appearanceOpacityItems[index].Index * 0.01, this.colorForOverlayIdx(index), 0);
    }

    private updateHairAndColors() {
        this.localPlayer.setComponentVariation(2, Data.hairList[this.currentGender][this.hairItem.Index].ID, 0, 2);
        this.localPlayer.setHairColor(this.hairColorItem.Index, this.hairHighlightItem.Index);
        this.localPlayer.setEyeColor(this.eyeColorItem.Index);
        this.localPlayer.setHeadOverlayColor(1, 1, this.beardColorItem.Index, 0);
        this.localPlayer.setHeadOverlayColor(2, 1, this.eyebrowColorItem.Index, 0);
        this.localPlayer.setHeadOverlayColor(5, 2, this.blushColorItem.Index, 0);
        this.localPlayer.setHeadOverlayColor(8, 2, this.lipstickColorItem.Index, 0);
        this.localPlayer.setHeadOverlayColor(10, 1, this.chestHairColorItem.Index, 0);
    }

    private applyCreatorOutfit() {
        if (this.currentGender == 0) {
            this.localPlayer.setDefaultComponentVariation();
            this.localPlayer.setComponentVariation(3, 15, 0, 2);
            this.localPlayer.setComponentVariation(4, 21, 0, 2);
            this.localPlayer.setComponentVariation(6, 34, 0, 2);
            this.localPlayer.setComponentVariation(8, 15, 0, 2);
            this.localPlayer.setComponentVariation(11, 15, 0, 2);
        } else {
            this.localPlayer.setDefaultComponentVariation();
            this.localPlayer.setComponentVariation(3, 15, 0, 2);
            this.localPlayer.setComponentVariation(4, 10, 0, 2);
            this.localPlayer.setComponentVariation(6, 35, 0, 2);
            this.localPlayer.setComponentVariation(8, 15, 0, 2);
            this.localPlayer.setComponentVariation(11, 15, 0, 2);
        }
    }

    private fillHairMenu() {
        this.hairItem = new NativeUI.UIMenuListItem("Hair", "Your character's hair.", new NativeUI.ItemsCollection(Data.hairList[this.currentGender].map(h => h.Name)));
        this.creatorHairMenu.AddItem(this.hairItem);

        this.hairColorItem = new NativeUI.UIMenuListItem("Hair Color", "Your character's hair color.", new NativeUI.ItemsCollection(this.hairColors));
        this.creatorHairMenu.AddItem(this.hairColorItem);

        this.hairHighlightItem = new NativeUI.UIMenuListItem("Hair Highlight Color", "Your character's hair highlight color.", new NativeUI.ItemsCollection(this.hairColors));
        this.creatorHairMenu.AddItem(this.hairHighlightItem);

        this.eyebrowColorItem = new NativeUI.UIMenuListItem("Eyebrow Color", "Your character's eyebrow color.", new NativeUI.ItemsCollection(this.hairColors));
        this.creatorHairMenu.AddItem(this.eyebrowColorItem);

        this.beardColorItem = new NativeUI.UIMenuListItem("Facial Hair Color", "Your character's facial hair color.", new NativeUI.ItemsCollection(this.hairColors));
        this.creatorHairMenu.AddItem(this.beardColorItem);

        this.eyeColorItem = new NativeUI.UIMenuListItem("Eye Color", "Your character's eye color.", new NativeUI.ItemsCollection(Data.eyeColors));
        this.creatorHairMenu.AddItem(this.eyeColorItem);

        this.blushColorItem = new NativeUI.UIMenuListItem("Blush Color", "Your character's blush color.", new NativeUI.ItemsCollection(this.blushColors));
        this.creatorHairMenu.AddItem(this.blushColorItem);

        this.lipstickColorItem = new NativeUI.UIMenuListItem("Lipstick Color", "Your character's lipstick color.", new NativeUI.ItemsCollection(this.lipstickColors));
        this.creatorHairMenu.AddItem(this.lipstickColorItem);

        this.chestHairColorItem = new NativeUI.UIMenuListItem("Chest Hair Color", "Your character's chest hair color.", new NativeUI.ItemsCollection(this.hairColors));
        this.creatorHairMenu.AddItem(this.chestHairColorItem);

        this.creatorHairMenu.AddItem(new NativeUI.UIMenuItem("Randomize", "~r~Randomizes your hair & colors."));
        this.creatorHairMenu.AddItem(new NativeUI.UIMenuItem("Reset", "~r~Resets your hair & colors."));
    }

    private resetParentsMenu(refresh = false) {
        this.fatherItem.Index = 0;
        this.motherItem.Index = 0;
        this.similarityItem.Index = (this.currentGender == 0) ? 100 : 0;
        this.skinSimilarityItem.Index = (this.currentGender == 0) ? 100 : 0;

        this.updateParents();
        if (refresh) this.creatorParentsMenu.RefreshIndex();
    }

    private resetFeaturesMenu(refresh = false) {
        for (let i = 0; i < Data.featureNames.length; i++) {
            this.featureItems[i].Index = 100;
            this.updateFaceFeature(i);
        }

        if (refresh) this.creatorFeaturesMenu.RefreshIndex();
    }

    private resetAppearanceMenu(refresh = false) {
        for (let i = 0; i < Data.appearanceNames.length; i++) {
            this.appearanceItems[i].Index = 0;
            this.appearanceOpacityItems[i].Index = 100;
            this.updateAppearance(i);
        }

        if (refresh) this.creatorAppearanceMenu.RefreshIndex();
    }

    private resetHairAndColorsMenu(refresh = false) {
        this.hairItem.Index = 0;
        this.hairColorItem.Index = 0;
        this.hairHighlightItem.Index = 0;
        this.eyebrowColorItem.Index = 0;
        this.beardColorItem.Index = 0;
        this.eyeColorItem.Index = 0;
        this.blushColorItem.Index = 0;
        this.lipstickColorItem.Index = 0;
        this.chestHairColorItem.Index = 0;
        this.updateHairAndColors();

        if (refresh) this.creatorHairMenu.RefreshIndex();
    }
}

const charCreator = new CharCreator();
export default charCreator;
