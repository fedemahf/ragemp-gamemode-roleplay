const NativeUI = require('../vendor/nativeui');

const Menu = NativeUI.Menu;
const UIMenuItem = NativeUI.UIMenuItem;
const UIMenuListItem = NativeUI.UIMenuListItem;
const UIMenuCheckboxItem = NativeUI.UIMenuCheckboxItem;
const UIMenuSliderItem = NativeUI.UIMenuSliderItem;
const BadgeStyle = NativeUI.BadgeStyle;
const Point = NativeUI.Point;
const ItemsCollection = NativeUI.ItemsCollection;
const Color = NativeUI.Color;
const ListItem = NativeUI.ListItem;

const player = mp.players.local;

interface ClothesMenuItem {
    itemTitle: string,
    itemDescription: string,
    itemVariationTitle: string,
    itemVariationDescription: string,
    componentOrPropId: number,
    isProp: boolean
}

const listClothesMenuItem: Array<ClothesMenuItem> = [
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

let menuList = [];
let mainMenu = new Menu("Clothes", "", new Point(50, 50));
menuList.push(mainMenu);
mainMenu.Visible = false;
mainMenu.MenuClose.on(closeMenu);
mp.keys.bind(0x71, false, toggleMenuOpen);

for (let clothesMenuItem of listClothesMenuItem) {
    createMenuItem(clothesMenuItem);
}

function createMenuItem(clothesMenuItem: ClothesMenuItem): void {
    let itemsDrawable = [];
    let itemsTextureArray = [];
    let numberOfVariations: number;
    let itemsTextureLimit: number;
    let drawableId: number;
    
    if (clothesMenuItem.isProp) {
        numberOfVariations = player.getNumberOfPropDrawableVariations(clothesMenuItem.componentOrPropId) + 1;
        drawableId = player.getPropIndex(clothesMenuItem.componentOrPropId);
        itemsTextureLimit = player.getNumberOfPropTextureVariations(clothesMenuItem.componentOrPropId, drawableId) + 1;
    } else {
        numberOfVariations = player.getNumberOfDrawableVariations(clothesMenuItem.componentOrPropId) + 1;
        drawableId = player.getDrawableVariation(clothesMenuItem.componentOrPropId);
        itemsTextureLimit = player.getNumberOfTextureVariations(clothesMenuItem.componentOrPropId, drawableId) + 1;
    }

    for (let i = 0; i < numberOfVariations; i++) {
        itemsDrawable.push(i.toString());
    }

    for (let i = 0; i < itemsTextureLimit; i++) {
        itemsTextureArray.push(i.toString());
    }

    const menuItem = new Menu(clothesMenuItem.itemTitle, "", new Point(50, 50));
    let itemMenuList = new UIMenuListItem(clothesMenuItem.itemTitle, clothesMenuItem.itemDescription, new ItemsCollection(itemsDrawable), drawableId);
    let itemMenuTextureList = new UIMenuListItem(clothesMenuItem.itemVariationTitle, clothesMenuItem.itemVariationDescription, new ItemsCollection(itemsTextureArray), (clothesMenuItem.isProp ? player.getPropTextureIndex(clothesMenuItem.componentOrPropId) : player.getTextureVariation(clothesMenuItem.componentOrPropId)));
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
                itemMenuTextureList.Collection = new NativeUI.ItemsCollection(itemsTextureNewArray).getListItems();
                itemMenuTextureList.Index = 0;
            break
    
            case itemMenuTextureList:
                mp.events.callRemote(callFunction, clothesMenuItem.componentOrPropId, drawable, texture);
        }
    });

    const menuItemGeneral = new UIMenuItem(clothesMenuItem.itemTitle, clothesMenuItem.itemDescription);
    mainMenu.AddItem(menuItemGeneral);
    mainMenu.BindMenuToItem(menuItem, menuItemGeneral);
    menuList.push(menuItem);
}

function toggleMenuOpen(): void {
    if (isAnyMenuOpen()) {
        for (let menu of menuList) {
            menu.Close();
        }
    } else {
        mainMenu.Open();
        mp.gui.chat.show(false);
        mp.gui.cursor.visible = false;
    }
}

function isAnyMenuOpen(): boolean {
    for (let menu of menuList) {
        if (menu.Visible) {
            return true;
        }
    }

    return false;
}

function closeMenu(): void {
    mp.gui.chat.show(true);
    mp.gui.cursor.visible = false;
}
