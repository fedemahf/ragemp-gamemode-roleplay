// const {Menu, UIMenuItem, UIMenuListItem, Point, ItemsCollection} = require('../vendor/nativeui');
import {Menu, UIMenuItem, UIMenuListItem, Point, ItemsCollection} from '../vendor/nativeui';

interface ClothesMenuItem {
    itemTitle: string,
    itemDescription: string,
    itemVariationTitle: string,
    itemVariationDescription: string,
    componentOrPropId: number,
    isProp: boolean
}

class ClothesMenu {
    private listClothesMenuItem: Array<ClothesMenuItem> = [
        {
            itemTitle: "Masks",
            itemDescription: "Select your mask.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your mask's color.",
            componentOrPropId: 1,
            isProp: false
        },
        {
            itemTitle: "Hats",
            itemDescription: "Select your hat.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your hat's color.",
            componentOrPropId: 0,
            isProp: true
        },
        {
            itemTitle: "Jackets",
            itemDescription: "Select your jacket.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your jacket's color.",
            componentOrPropId: 11,
            isProp: false
        },
        {
            itemTitle: "Shirts",
            itemDescription: "Select your shirt.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your shirt's color.",
            componentOrPropId: 8,
            isProp: false
        },
        {
            itemTitle: "Pants",
            itemDescription: "Select your pants.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your pants' color.",
            componentOrPropId: 4,
            isProp: false
        },
        {
            itemTitle: "Shoes",
            itemDescription: "Select your shoes.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your shoes' color.",
            componentOrPropId: 6,
            isProp: false
        },
        {
            itemTitle: "Hands",
            itemDescription: "Select your hands.",
            itemVariationTitle: "Variation",
            itemVariationDescription: "Select your hands' variation.",
            componentOrPropId: 3,
            isProp: false
        },
        {
            itemTitle: "Glasses",
            itemDescription: "Select your glasses.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your glasses' variation.",
            componentOrPropId: 1,
            isProp: true
        },
        {
            itemTitle: "Acessories",
            itemDescription: "Select your acessories.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your acessories' color.",
            componentOrPropId: 7,
            isProp: false
        },
        {
            itemTitle: "Bags",
            itemDescription: "Select your bags.",
            itemVariationTitle: "Color",
            itemVariationDescription: "Select your bags' color.",
            componentOrPropId: 5,
            isProp: false
        }
    ];

    private mainMenu: Menu;
    private menuList: Array<Menu> = [];
    private player: PlayerMp;

    constructor() {
        this.player = mp.players.local;
        this.mainMenu = new Menu("Clothes", "", new Point(50, 50));
        this.menuList.push(this.mainMenu);
        this.mainMenu.Visible = false;
        this.mainMenu.MenuClose.on(this.closeMenu.bind(this));
        mp.keys.bind(0x71, false, this.toggleMenuOpen.bind(this));

        for (let clothesMenuItem of this.listClothesMenuItem) {
            this.createMenuItem(clothesMenuItem);
        }
    }

    private createMenuItem(clothesMenuItem: ClothesMenuItem): void {
        let itemsDrawable: Array<string> = [];
        let itemsTextureArray: Array<string> = [];
        let numberOfVariations: number;
        let itemsTextureLimit: number;
        let drawableId: number;

        if (clothesMenuItem.isProp) {
            numberOfVariations = this.player.getNumberOfPropDrawableVariations(clothesMenuItem.componentOrPropId) + 1;
            drawableId = this.player.getPropIndex(clothesMenuItem.componentOrPropId);
            itemsTextureLimit = this.player.getNumberOfPropTextureVariations(clothesMenuItem.componentOrPropId, drawableId) + 1;
        } else {
            numberOfVariations = this.player.getNumberOfDrawableVariations(clothesMenuItem.componentOrPropId) + 1;
            drawableId = this.player.getDrawableVariation(clothesMenuItem.componentOrPropId);
            itemsTextureLimit = this.player.getNumberOfTextureVariations(clothesMenuItem.componentOrPropId, drawableId) + 1;
        }

        for (let i = 0; i < numberOfVariations; i++) {
            itemsDrawable.push(i.toString());
        }

        for (let i = 0; i < itemsTextureLimit; i++) {
            itemsTextureArray.push(i.toString());
        }

        const menuItem = new Menu(clothesMenuItem.itemTitle, "", new Point(50, 50));
        let itemMenuList = new UIMenuListItem(clothesMenuItem.itemTitle, clothesMenuItem.itemDescription, new ItemsCollection(itemsDrawable), drawableId);
        let itemMenuTextureList = new UIMenuListItem(clothesMenuItem.itemVariationTitle, clothesMenuItem.itemVariationDescription, new ItemsCollection(itemsTextureArray), (clothesMenuItem.isProp ? this.player.getPropTextureIndex(clothesMenuItem.componentOrPropId) : this.player.getTextureVariation(clothesMenuItem.componentOrPropId)));
        menuItem.AddItem(itemMenuList);
        menuItem.AddItem(itemMenuTextureList);
        menuItem.Visible = false;

        menuItem.ListChange.on((item, listIndex) => {
            let drawable: number = parseInt(itemMenuList.SelectedItem.DisplayText);
            let texture: number = parseInt(itemMenuTextureList.SelectedItem.DisplayText);
            let callFunction: string = (clothesMenuItem.isProp ? "setProp" : "setClothes");

            switch (item) {
                case itemMenuList:
                    mp.events.callRemote(callFunction, clothesMenuItem.componentOrPropId, drawable, 0);
                    let itemsTextureNewArray = [];
                    for (let i = 0; i < itemsTextureLimit; i++) itemsTextureNewArray.push(i.toString());
                    itemMenuTextureList.Collection = new ItemsCollection(itemsTextureNewArray).getListItems();
                    itemMenuTextureList.Index = 0;
                break;
        
                case itemMenuTextureList:
                    mp.events.callRemote(callFunction, clothesMenuItem.componentOrPropId, drawable, texture);
                break;
            }
        });

        const menuItemGeneral = new UIMenuItem(clothesMenuItem.itemTitle, clothesMenuItem.itemDescription);
        this.mainMenu.AddItem(menuItemGeneral);
        this.mainMenu.BindMenuToItem(menuItem, menuItemGeneral);
        this.menuList.push(menuItem);
    }

    private toggleMenuOpen(): void {
        if (this.isAnyMenuOpen()) {
            for (let menu of this.menuList) {
                menu.Close();
            }
        } else {
            this.mainMenu.Open();
            mp.gui.chat.show(false);
            mp.gui.cursor.visible = false;
        }
    }

    private isAnyMenuOpen(): boolean {
        for (let menu of this.menuList) {
            if (menu.Visible) {
                return true;
            }
        }

        return false;
    }

    private closeMenu(): void {
        mp.gui.chat.show(true);
        mp.gui.cursor.visible = false;
    }
}

const clothesMenu = new ClothesMenu();
export default clothesMenu;
