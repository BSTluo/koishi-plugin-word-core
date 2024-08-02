import { Service, Context, Schema } from "koishi";
import { CacheFunction, ToolsFunction, WordCache, wordService } from './service/index';
import { wordDriver } from "./driver";
import { Editor } from "./service/editor/editor";
import { Permission } from "./service/permission/permission";
// import { User, UserFunction } from "./service/user/user";
import { User } from "./service/user/user";
import { triggerFunction } from "./extend/trigger";
import { statementFunction } from "./extend/statement";
// import { Config, configFunction } from "./service/config/config";
import * as wordConfig from "./service/config/config";

declare module 'koishi' {
  interface Context
  {
    word: word;
  }
}

export class word extends Service
{
  driver: wordDriver;
  cache: CacheFunction;
  editor: Editor;
  tools: ToolsFunction;
  // user: UserFunction;
  user: User;
  trigger: triggerFunction;
  permission: Permission;
  statement: statementFunction;
  // config: configFunction;
  config: wordConfig.Config;

  constructor(ctx: Context, config: word.Config)
  {
    super(ctx, 'word', true);

    const WordDriver = new wordDriver(this, ctx);
    this.driver = WordDriver;

    const wordServiceTemp = new wordService(ctx);
    this.tools = wordServiceTemp.Tools;
    this.tools.url = config.searchEndpoint;
    this.cache = wordServiceTemp.Cache;
    this.editor = wordServiceTemp.Editor;
    this.user = wordServiceTemp.User;
    this.permission = wordServiceTemp.Permission;
    this.trigger = wordServiceTemp.trigger;
    this.statement = wordServiceTemp.statement;
    this.cache.cacheRefresh();
    this.config = wordServiceTemp.config;
  }
}

export namespace word
{
  export interface Config
  {
    searchEndpoint: string;
  }

  export const Config: Schema<Config> = Schema.object({
    searchEndpoint: Schema.string().description('词库插件市场后端地址').default('https://wplugin.reifuu.icu')
  });
}
