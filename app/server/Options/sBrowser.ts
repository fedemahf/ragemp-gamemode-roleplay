class Browser {
  showNotification (player: PlayerMp, text: string, theme?: string, time?: number, title?: string, img?: string): void {
    let str = 'App.Notifications.addNotification({'
    str += `text: "${text}",`
    if (theme) str += `theme: "${theme}",`
    if (time) str += `time: "${time}",`
    if (title) str += `title: "${title}",`
    if (img) str += `img: "${img}",`
    str += '});'
    this.pasteJs(player, str)
  }

  setLoadingScreenState (player: PlayerMp, state: boolean): void {
    this.pasteJs(player, `App.Loading.showLoading(${state});`)
  }

  setUrl (player: PlayerMp, url: string, enableCursor: boolean): void {
    player.call('cBrowser-SetUrl', [url, enableCursor])
  }

  pasteJs (player: PlayerMp, data: string): void {
    player.call('cBrowser-PasteJs', [data])
  }
}

export default new Browser()
