import { Context, Service } from "koishi";
import * as Tools from './Tools/Tools';
import * as User from './User/User';
import * as Cache from "./Editor/Cache";

export * from './Tools/Tools';

declare module 'koishi' {
  interface Context {
    word: word;
  }
}

export class word extends Service {
  Tools: Tools.ToolsFunction = {} as Tools.ToolsFunction;

  User: User.UserFunction = {} as User.UserFunction;

  Cache: Cache.CacheFunction = {} as Cache.CacheFunction;

  constructor(ctx: Context) {
    // 这样写你就不需要手动给 ctx 赋值了
    super(ctx, 'word', true);

    this.Tools.readDB = (dbName, key) => { return Tools.readDBFunction(this.ctx, dbName, key); };
    this.Tools.writeDB = (dbName, key, data) => { return Tools.writeDBFunction(this.ctx, dbName, key, data); };
    this.Tools.getDB = (dbName) => { return Tools.getDBFunction(ctx, dbName); };
    this.Tools.removeDB = async (dbName, key) => { return Tools.removeDBFunction(ctx, dbName, key); };

    this.User.getData = (uid) => { return User.getData(this.Tools.readDB, uid); };
    this.User.updateData = (uid, data) => { return User.updateData(this.Tools.writeDB, uid, data); };
    this.User.getItem = (uid, cell, item) => { return User.getItem(this.Tools.readDB, uid, cell, item); };
    this.User.updateItem = (uid, cell, itemName, amount) => { return User.updateItem(this.Tools.readDB, this.Tools.writeDB, uid, cell, itemName, amount); };

    this.Cache.getCache = () => { return Cache.getCache(this.Tools.getDB); };
  }
}