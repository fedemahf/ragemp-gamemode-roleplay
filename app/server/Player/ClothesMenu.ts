/// <reference path="../index.d.ts" />

import Database from '../Database'
import { PlayerClothes as DatabasePlayerClothes } from '../Database/entity/PlayerClothes'
// import DB from '../Options/sDB'

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
  const playerClothes: DatabasePlayerClothes[] = []

  for (let i = 0; i < player.props.length; ++i) {
    if (player.props[i] !== undefined) {
      player.setProp(i, player.props[i].drawable, player.props[i].texture)

      const row = new DatabasePlayerClothes()
      row.player_id = player.id_sql
      row.component = i
      row.drawable = player.props[i].drawable
      row.texture = player.props[i].texture
      row.is_prop = true
      playerClothes.push(row)
    }
  }

  for (let i = 0; i < player.clothes.length; ++i) {
    if (player.clothes[i] !== undefined) {
      player.setClothes(i, player.clothes[i].drawable, player.clothes[i].texture, 2)

      const row = new DatabasePlayerClothes()
      row.player_id = player.id_sql
      row.component = i
      row.drawable = player.clothes[i].drawable
      row.texture = player.clothes[i].texture
      row.is_prop = false
      playerClothes.push(row)
    }
  }

  await Database.removePlayerClothesById(player.id_sql)
  await Database.savePlayerClothes(playerClothes)
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
  const playerClothes: DatabasePlayerClothes[] = await Database.getPlayerClothesById(player.id_sql)

  for (const row of playerClothes) {
    if (row.is_prop) {
      player.setProp(row.component, row.drawable, row.texture)
      player.props[row.component] = { drawable: row.drawable, texture: row.texture }
    } else {
      player.setClothes(row.component, row.drawable, row.texture, 2)
      player.clothes[row.component] = { drawable: row.drawable, texture: row.texture }
    }
  }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
  player.clothes = []
  player.props = []
})
