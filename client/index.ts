import { Context } from '@koishijs/client'
import Page from './page.vue'

import 'virtual:uno.css'

export default (ctx: Context) => {
  ctx.page({
    name: '扩展页面',
    path: '/custom-page',
    component: Page,
  })
}
