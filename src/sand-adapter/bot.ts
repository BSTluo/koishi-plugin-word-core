import { Context, Bot, Fragment } from "koishi";
import { SandboxMessenger } from "./message";
import { SendOptions } from "@satorijs/protocol";

export class wordBot<C extends Context> extends Bot<C>
{
  constructor(ctx: C, config: wordBot.Config)
  {
    super(ctx, config as any, 'word-sandbox');
    this.platform = 'word-sandbox';
    this.selfId = 'word-core';
    this.user = {
      id: 'word-core',
      name: 'word-core',
      nick: 'Word Core',
    }
  }

  // 这里接下来引用的是
  // https://github.com/koishijs/webui/blob/main/plugins/sandbox/src/bot.ts#L13C10-L13C25


  createSession(msg: string)
  {
    const session = this.session({
      user: { id: 'word-user', name: 'word-user' },
    });
    session.type = 'message';
    session.userId = 'word-user';
    session.username = 'word-user';
    session.channelId = 'word-sandbox';
    session.isDirect = true;
    session.content = msg;
    this.dispatch(session);
  }

  async sendMessage(channelId: string, content: Fragment, guildId?: string, options?: SendOptions): Promise<string[]>
  {
    await new SandboxMessenger(this, channelId).send(content);
    return [];
  }

  async sendPrivateMessage(userId: string, content: Fragment, guildId?: string, options?: SendOptions): Promise<string[]>
  {
    await new SandboxMessenger(this, 'private:word-sandbox').send(content);
    return [];
  }
}

export namespace wordBot
{
  export interface Config
  {

  }

}

export default wordBot;

// declare module 'koishi' {
//   interface Events {
//     'word-sandbox-request'(content: Fragment): void;
//   }
// }
