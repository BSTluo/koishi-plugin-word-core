import { Context } from '@koishijs/client'
import App from './src/App.vue'
import Page from './page.vue'


import 'virtual:uno.css'

export default (ctx: Context) => {
  ctx.page({
    name: '词库',
    path: '/word-core',
    component: Page,
  })
}
