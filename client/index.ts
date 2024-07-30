import { Context } from '@koishijs/client'
import Home from './src/market/home.vue'
import wordBlockly from './src/blockly/blockly.vue'

import 'virtual:uno.css'

export default (ctx: Context) => {
  ctx.page({
    name: '词库',
    path: '/word-core',
    component: Home,
  })

  ctx.page({
    name: '词库Blocky',
    path: '/word-core-blocky',
    component: wordBlockly,
  })
}
