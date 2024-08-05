import { SendOptions } from "@satorijs/protocol";
import { Context, Bot, Fragment } from "koishi";

export class wordBot<C extends Context> extends Bot<C> {
  constructor(ctx: C, config: wordBot.Config) {
    super(ctx, config as any);
    this.platform = 'word-sandbox'
    this.selfId = 'word-core'
    this.user.name = 'word-core'
  }

  createSession(msg: string) {
    const session = this.session({
      user: { id: 'word-user', name: 'word-user' },
    })
    session.type = 'message'
    session.userId = 'word-user'
    session.username = 'word-user'
    session.channelId = 'word-sandbox'
    session.isDirect = true
    session.content = msg
    this.dispatch(session)
  }

  async sendMessage(channelId: string, content: Fragment, guildId?: string, options?: SendOptions): Promise<string[]> {
    // 先暂时不解析了，先这样吧
    // 希望没有at之类的是
    // console.log('send message', channelId, content, guildId, options)
    const ctx = this.ctx as Context
    // ctx.emit('word-sandbox-request', content);
    ctx.console.broadcast(
      'word-sanbox-request',
      content
    )
    // this.client.send({
    //   type: 'word-sanbox-request',
    //   body: content
    // });

    return []
  }

  async sendPrivateMessage(userId: string, content: Fragment, guildId?: string, options?: SendOptions): Promise<string[]> {
    // console.log('send private message', userId, content, guildId, options)
    return []
  }
}

export namespace wordBot {
  export interface Config {
  }
}

export default wordBot;

// declare module 'koishi' {
//   interface Events {
//     'word-sandbox-request'(content: Fragment): void;
//   }
// }
