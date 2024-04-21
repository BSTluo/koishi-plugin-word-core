import { Context } from '@koishijs/client'
import Home from './src/home.vue'
import Blockly from './src/blockly.vue'

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
    component: Blockly,
  })
}
