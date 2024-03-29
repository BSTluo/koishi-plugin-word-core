import { Service, Context } from "koishi";
import { CacheFunction, ToolsFunction, WordCache, wordService } from './service/index';
import { wordDriver } from "./driver";
import { Editor } from "./service/editor/editor";
import { Permission } from "./service/permission/permission";
// import { User, UserFunction } from "./service/user/user";
import { User } from "./service/user/user";
import { triggerFunction } from "./extend/trigger";
import { statementFunction } from "./extend/statement";
// import { Config, configFunction } from "./service/config/config";
import { Config } from "./service/config/config";

declare module 'koishi' {
  interface Context {
    word: word;
  }
}

export class word extends Service {
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
  config: Config;

  constructor(ctx: Context) {
    super(ctx, 'word', true);

    const WordDriver = new wordDriver(this, ctx);
    this.driver = WordDriver;

    const wordServiceTemp = new wordService(ctx);
    this.cache = wordServiceTemp.Cache;
    this.editor = wordServiceTemp.Editor;
    this.tools = wordServiceTemp.Tools;
    this.user = wordServiceTemp.User;
    this.permission = wordServiceTemp.Permission;
    this.trigger = wordServiceTemp.trigger;
    this.statement = wordServiceTemp.statement;
    this.cache.cacheRefresh();
    this.config = wordServiceTemp.config;
  }
}