/// <reference path="../index.d.ts" />

import DB from '../Options/sDB'

mp.events.add('setClothes', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
  player.setClothes(componentId, drawable, texture, 2)
  player.clothes[componentId] = { drawable: drawable, texture: texture }
})

mp.events.add('setProp', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
  player.setProp(componentId, drawable, texture)
  player.props[componentId] = { drawable: drawable, texture: texture }
})

const freemodeCharacters = [mp.joaat('mp_m_freemode_01'), mp.joaat('mp_f_freemode_01')]

mp.events.addCommand('clothes', (player: PlayerMp) => {
  if (!freemodeCharacters.includes(player.model)) {
    player.outputChatBox('/clothes command is restricted to freemode characters.')
  } else if (player.vehicle) {
    player.outputChatBox("You can't use this command inside a vehicle.")
  } else {
    player.call('toggleClothesMenu')
  }
})

mp.events.add('ClothesMenu_Exit', async (player: PlayerMp) => {
  const rows = []

  await DB.query(`DELETE FROM player_clothes WHERE player_id = ${player.id_sql};`)

  for (let i = 0; i < player.props.length; ++i) {
    if (player.props[i] !== undefined) {
      player.setProp(i, player.props[i].drawable, player.props[i].texture)
      rows.push({ component: i, drawable: player.props[i].drawable, texture: player.props[i].texture, isProp: true })
    }
  }

  for (let i = 0; i < player.clothes.length; ++i) {
    if (player.clothes[i] !== undefined) {
      player.setClothes(i, player.clothes[i].drawable, player.clothes[i].texture, 2)
      rows.push({ component: i, drawable: player.clothes[i].drawable, texture: player.clothes[i].texture, isProp: false })
    }
  }

  let queryInsert: string = 'INSERT INTO `player_clothes` (`player_id`, `component`, `drawable`, `texture`, `is_prop`) VALUES '

  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i]

    if (i !== 0) {
      queryInsert += ', '
    }

    queryInsert += `('${player.id_sql}', '${row.component}', '${row.drawable}', '${row.texture}', ${row.isProp})`
  }

  await DB.query(queryInsert)
})

mp.events.add('ClothesMenu_Reload', async (player: PlayerMp) => {
  for (let i = 0; i < player.props.length; ++i) {
    if (player.props[i] !== undefined) {
      player.setProp(i, player.props[i].drawable, player.props[i].texture)
    }
  }

  for (let i = 0; i < player.clothes.length; ++i) {
    if (player.clothes[i] !== undefined) {
      player.setClothes(i, player.clothes[i].drawable, player.clothes[i].texture, 2)
    }
  }
})

mp.events.add('ClothesMenu_Load', async (player: PlayerMp) => {
  const result: any = await DB.query(`SELECT component, drawable, texture, is_prop FROM player_clothes WHERE player_id = '${player.id_sql}'`)

  if (result[0]) {
    for (const row of result) {
      if (row.is_prop) {
        player.setProp(row.component, row.drawable, row.texture)
        player.props[row.component] = { drawable: row.drawable, texture: row.texture }
      } else {
        player.setClothes(row.component, row.drawable, row.texture, 2)
        player.clothes[row.component] = { drawable: row.drawable, texture: row.texture }
      }
    }
  }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
  player.clothes = []
  player.props = []
})
