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

let player = mp.players.local;

let todosMenus = [];
let menuClothesItem = [
    new UIMenuItem("Masks", "Select your mask."),
    new UIMenuItem("Hats", "Select your hat."),
    new UIMenuItem("Jackets", "Select your jacket."),
    new UIMenuItem("Shirts", "Select your shirt."),
    new UIMenuItem("Legs", "Select your pant."),
    new UIMenuItem("Shoes", "Select your shoes."),
    new UIMenuItem("Hands", "Select your hands."),
    new UIMenuItem("Glasses", "Select your glasses."),
    new UIMenuItem("Acessories", "Select your acessories."),
    new UIMenuItem("Bags", "Select your bag.")
];

let menuRoupas = new Menu("Clothes", "", new Point(50, 50));

for (let i = 0; i < menuClothesItem.length; ++i) {
    menuRoupas.AddItem(menuClothesItem[i]);
}

menuRoupas.Visible = false;
todosMenus.push(menuRoupas);

function createMenuItem(itemTitle: string, itemDescription: string, colorItem: string, colorDescription: string, componentOrPropId: number, isProp: boolean) {
    let itemsDrawable = [];
    let itemsTextureArray = [];
    let numberOfVariations: number;
    let itemsTextureLimit: number;
    let drawableId: number;
    
    if (isProp) {
        numberOfVariations = player.getNumberOfPropDrawableVariations(componentOrPropId) + 1;
        drawableId = player.getPropIndex(componentOrPropId);
        itemsTextureLimit = player.getNumberOfPropTextureVariations(componentOrPropId, drawableId) + 1;
    } else {
        numberOfVariations = player.getNumberOfDrawableVariations(componentOrPropId) + 1;
        drawableId = player.getDrawableVariation(componentOrPropId);
        itemsTextureLimit = player.getNumberOfTextureVariations(componentOrPropId, drawableId) + 1;
    }

    for (let i = 0; i < numberOfVariations; i++) {
        itemsDrawable.push(i.toString());
    }

    for (let i = 0; i < itemsTextureLimit; i++) {
        itemsTextureArray.push(i.toString());
    }

    const result = new Menu(itemTitle, "", new Point(50, 50));
    let itemMenuList = new UIMenuListItem(itemTitle, itemDescription, new ItemsCollection(itemsDrawable), drawableId);
    let itemMenuTextureList = new UIMenuListItem(colorItem, colorDescription, new ItemsCollection(itemsTextureArray), (isProp ? player.getPropTextureIndex(componentOrPropId) : player.getTextureVariation(componentOrPropId)));
    result.AddItem(itemMenuList);
    result.AddItem(itemMenuTextureList);
    result.Visible = false;

    result.ListChange.on((item, listIndex) => {
        let drawable: number = parseInt(itemMenuList.SelectedItem.DisplayText);
        let texture: number = parseInt(itemMenuTextureList.SelectedItem.DisplayText);
        let callFunction: string = (isProp ? "setProp" : "setClothes");

        switch (item) {
            case itemMenuList:
                mp.events.callRemote(callFunction, componentOrPropId, drawable, 0);
                let itemsTextureNewArray = [];
                for (let i = 0; i < itemsTextureLimit; i++) itemsTextureNewArray.push(i.toString());
                itemMenuTextureList.Collection = new NativeUI.ItemsCollection(itemsTextureNewArray).getListItems();
                itemMenuTextureList.Index = 0;
            break
    
            case itemMenuTextureList:
                mp.events.callRemote(callFunction, componentOrPropId, drawable, texture);
        }
    });

    return result;
}

const menuClothesMask = createMenuItem("Masks", "Select your mask.", "Color", "Select your mask's color.", 1, false);
const menuClothesHats = createMenuItem("Hats", "Select your hat.", "Color", "Select your hat's color.", 0, true);
const menuClothesJackets = createMenuItem("Jackets", "Select your jacket.", "Color", "Select your jacket's color.", 11, false);
const menuClothesShirts = createMenuItem("Shirts", "Select your shirt.", "Color", "Select your shirt's color.", 8, false);
const menuClothesPants = createMenuItem("Pants", "Select your pants.", "Color", "Select your pants' color.", 4, false);
const menuClothesShoes = createMenuItem("Shoes", "Select your shoes.", "Color", "Select your shoes' color.", 6, false);
const menuClothesHands = createMenuItem("Hands", "Select your hands.", "Variation", "Select your hands' variation.", 3, false);
const menuClothesGlasses = createMenuItem("Glasses", "Select your glasses.", "Color", "Select your glasses' variation.", 1, true);
const menuClothesAccesories = createMenuItem("Acessories", "Select your acessories.", "Color", "Select your acessories' color.", 7, false);
const menuClothesBags = createMenuItem("Bags", "Select your bags.", "Color", "Select your bags' color.", 5, false);

todosMenus.push(
    menuClothesMask,
    menuClothesHats,
    menuClothesJackets,
    menuClothesShirts,
    menuClothesPants,
    menuClothesShoes,
    menuClothesHands,
    menuClothesGlasses,
    menuClothesAccesories,
    menuClothesBags
);

menuRoupas.BindMenuToItem(menuClothesMask,          menuClothesItem[0]);
menuRoupas.BindMenuToItem(menuClothesHats,          menuClothesItem[1]);
menuRoupas.BindMenuToItem(menuClothesJackets,       menuClothesItem[2]);
menuRoupas.BindMenuToItem(menuClothesShirts,        menuClothesItem[3]);
menuRoupas.BindMenuToItem(menuClothesPants,         menuClothesItem[4]);
menuRoupas.BindMenuToItem(menuClothesShoes,         menuClothesItem[5]);
menuRoupas.BindMenuToItem(menuClothesHands,         menuClothesItem[6]);
menuRoupas.BindMenuToItem(menuClothesGlasses,       menuClothesItem[7]);
menuRoupas.BindMenuToItem(menuClothesAccesories,    menuClothesItem[8]);
menuRoupas.BindMenuToItem(menuClothesBags,          menuClothesItem[9]);

mp.keys.bind(0x71, false, toggleMenuOpen);
menuRoupas.MenuClose.on(closeMenu);

function toggleMenuOpen() {
    if (isAnyMenuOpen()) {
        for (let menu of todosMenus) {
            menu.Close();
        }
        // todosMenus.forEach(function(element, index, array) {
        //     element.Close()
        // });
    } else {
        menuRoupas.Open();
        mp.gui.chat.show(false);
        mp.gui.cursor.visible = false;
    }
}

function isAnyMenuOpen(): boolean {
    for (let menu of todosMenus) {
        if (menu.Visible) {
            return true;
        }
    }

    return false;
}

function closeMenu() {
    mp.gui.chat.show(true);
    mp.gui.cursor.visible = false;
}