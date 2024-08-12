import { Context } from '@koishijs/client'
import Home from './src/market/home.vue'
import wordBlockly from './src/blockly/blockly.vue'
import {} from '@koishijs/plugin-auth'

import 'virtual:uno.css'

export default (ctx: Context) => {
  ctx.page({
    name: '词库',
    path: '/word-core',
    component: Home,
    authority: 1
  })

  ctx.page({
    name: '词库Blocky',
    path: '/word-core-blocky',
    component: wordBlockly,
    authority: 1
  })
}
