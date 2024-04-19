import { Context } from "koishi";
import * as Tools from './tools/tools';
import * as User from './user/user';
import * as Cache from "./editor/cache";
import * as Editor from './editor/editor';
import * as Permission from './permission/permission';
import * as trigger from "../extend/trigger";
import * as statement from "../extend/statement";
import * as Config from "./config/config";

export * from './tools/tools';
export * from './editor/cache';

export class wordService {
  private ctx: Context;

  public Tools: Tools.ToolsFunction = {} as Tools.ToolsFunction;

  public User: User.User = {} as User.User;

  public Cache: Cache.CacheFunction = {} as Cache.CacheFunction;

  public Editor: Editor.Editor = {} as Editor.Editor;

  public Permission: Permission.Permission = {} as Permission.Permission;

  public trigger: trigger.triggerFunction = {} as trigger.triggerFunction;

  public statement: statement.statementFunction = {} as statement.statementFunction;

  public config: Config.Config = {} as Config.Config;

  constructor(ctx: Context) {
    this.ctx = ctx;

    this.ctx.inject(['database'], async (ctx) => {
      this.Tools.readDB = (dbName, key) => { return Tools.readDBFunction(ctx, dbName, key); };
      this.Tools.writeDB = (dbName, key, data) => { return Tools.writeDBFunction(ctx, dbName, key, data); };
      this.Tools.getDB = (dbName) => { return Tools.getDBFunction(ctx, dbName); };
      this.Tools.removeDB = async (dbName, key) => { return Tools.removeDBFunction(ctx, dbName, key); };
      this.Tools.randomNumber = Tools.randomNumber;
    });

    while (!this.Tools.readDB) { }

    const user = new User.User(this.Tools.readDB, this.Tools.writeDB);

    // 直接等于会导致this指针错误的问题
    this.User.getData = (uid) => { return user.getData(uid); };
    this.User.updateData = (uid, data) => { return user.updateData(uid, data); };
    this.User.getItem = (uid, cell, item) => { return user.getItem(uid, cell, item); };
    this.User.updateItemForce = (uid, cell, itemName, amount) => { return user.updateItemForce(uid, cell, itemName, amount); };
    this.User.getEditWord = (uid) => { return user.getEditWord(uid); };
    this.User.setEditWord = (uid, newDB) => { return user.setEditWord(uid, newDB); };
    this.User.saveTemp = () => { return user.saveTemp(); };
    this.User.updateTemp = (uid, data) => { return user.updateTemp(uid, data); };
    this.User.updateItem = (uid, cell, itemName, amount) => { return user.updateItem(uid, cell, itemName, amount); };

    this.User.getConfig = (uid) => { return user.getConfig(uid); };
    this.User.setConfig = (uid, key, value) => { return user.setConfig(uid, key, value); };
    this.User.setConfigForce = (uid, key, value) => { return user.setConfigForce(uid, key, value); };
    this.User.saveConfig = () => { return user.saveConfig(); };

    this.Cache.getCache = Cache.getCache;
    this.Cache.cacheRefresh = () => { return Cache.cacheRefresh(this.Tools.getDB); };
    this.Cache.nowCache = Cache.wordCache;
    this.Cache.rmCache = Cache.rmCache;
    this.Cache.addCache = Cache.addCache;

    this.Permission = new Permission.Permission(this.Tools.readDB, this.Tools.writeDB);

    this.Editor = new Editor.Editor(this.Tools, this.Cache);

    this.trigger = {
      trigger: trigger.trigger,
      addTrigger: trigger.addTrigger,
      rmTrigger: trigger.rmTrigger
    };

    this.statement = {
      statement: statement.statement,
      ifStatement: statement.ifStatement,
      rmStatement: statement.rmStatement,
      addStatement: statement.addStatement
    };

    let config = new Config.Config(this.Tools, this.Cache);
    this.config.getConfig = (key) => { return config.getConfig(key); };
    this.config.updateConfig = (key, value) => { return config.updateConfig(key, value); };
  }
}