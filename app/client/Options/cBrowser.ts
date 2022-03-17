class BrowserSingletone {
  browser: BrowserMp

  constructor () {
    this.browser = mp.browsers.new('package://cef/index.html')

    mp.events.add({
      'cBrowser-SetUrl': (url: string, enableCursor: boolean) => {
        this.setUrl(url, enableCursor)
      },

      'cBrowser-PasteJs': (data: string) => {
        this.pasteJS(data)
      }
    })
  }

  setUrl (url: string, enableCursor: boolean): void {
    const path = `App.Router.push('${url}');`
    this.setInteractState(enableCursor)
    this.pasteJS(path)
  }

  pasteJS (data: string): void {
    this.browser.execute(data)
  }

  setInteractState (state: boolean): void {
    mp.gui.cursor.visible = state
    mp.game.ui.displayRadar(!state)
    mp.gui.chat.show(!state)
    mp.nametags.enabled = !state
  }
}

// eslint-disable-next-line no-new
new BrowserSingletone()
