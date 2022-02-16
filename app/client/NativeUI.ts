const { Point, Menu, UIMenuItem, UIMenuListItem, ItemsCollection, UIMenuSliderItem, UIMenuCheckboxItem } = require('./vendor/nativeui');

const menu = new Menu('Test UI', 'Test UI Subtitle', new Point(50, 50));
menu.AddItem(new UIMenuItem('First menu item', 'My menu item has an ~r~awesome ~w~description!'));
menu.AddItem(new UIMenuListItem(
	"List Item",
	"Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.",
	new ItemsCollection(["Item 1", "Item 2", "Item 3"])
));
menu.AddItem(new UIMenuSliderItem(
	"Slider Item",
	["Fugiat", "pariatur", "consectetur", "ex", "duis", "magna", "nostrud", "et", "dolor", "laboris"],
	5,
	"Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint.",
	true
));
menu.AddItem(new UIMenuCheckboxItem(
	"Checkbox Item",
	false,
	"Fugiat pariatur consectetur ex duis magna nostrud et dolor laboris est do pariatur amet sint."
));

menu.ItemSelect.on(item => {
	if (item instanceof UIMenuListItem) {
		console.log(item.SelectedItem.DisplayText, item.SelectedItem.Data);
	} else if (item instanceof UIMenuSliderItem) {
		console.log(item.Text, item.Index, item.IndexToItem(item.Index));
	} else {
		console.log(item.Text);
	}
});

// ui.SliderChange.on((item, index, value) => {
// 	console.log(item.Text, index, value);
// });

// menu.MenuOpen.on(() => {
// 	// mp.gui.chat.show(false);
// 	mp.events.callRemote("LoggerDebug", `menu.MenuOpen.on`);
// });

menu.MenuClose.on((close: boolean | undefined) => {
	// mp.gui.chat.show(close ? true : false);
	mp.gui.chat.show(true);
	// mp.events.callRemote("LoggerDebug", `menu.MenuClose.on ${close ? true : false}`);
});

mp.keys.bind(0x71, false, () => {
	if (menu.Visible) {
        menu.Close();
        // mp.gui.cursor.visible = false;
        // mp.gui.chat.show(true);
    } else {
        menu.Open();
        // mp.gui.cursor.visible = false;
		// mp.events.callRemote("LoggerDebug", `mp.keys.bind 0x71`);
		mp.gui.chat.show(false);
    }
});
