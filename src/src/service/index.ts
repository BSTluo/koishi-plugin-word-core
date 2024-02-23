import { Context } from "koishi";
import * as Tools from './tools/tools';
import * as User from './user/user';
import * as Cache from "./editor/cache";
import * as Editor from './editor/editor';
import * as Permission from './permission/permission';
import * as trigger from "../extend/trigger";
import * as statement from "../extend/statement";

export * from './tools/tools';
export * from './editor/cache';
export * from './editor/cache';

export const inject = {
  require: ['database']
};

export class wordService {
  private ctx: Context;

  public Tools: Tools.ToolsFunction = {} as Tools.ToolsFunction;

  public User: User.UserFunction = {} as User.UserFunction;

  public Cache: Cache.CacheFunction = {} as Cache.CacheFunction;

  public Editor: Editor.Editor = {} as Editor.Editor;

  public Permission: Permission.Permission = {} as Permission.Permission;

  public trigger: trigger.triggerFunction = {} as trigger.triggerFunction;

  public statement: statement.statementFunction = {} as statement.statementFunction;

  constructor(ctx: Context) {
    this.ctx = ctx;

    this.ctx.inject(['database'], async ctx => {
      this.Tools.readDB = (dbName, key) => { return Tools.readDBFunction(ctx, dbName, key); };
      this.Tools.writeDB = (dbName, key, data) => { return Tools.writeDBFunction(ctx, dbName, key, data); };
      this.Tools.getDB = (dbName) => { return Tools.getDBFunction(ctx, dbName); };
      this.Tools.removeDB = async (dbName, key) => { return Tools.removeDBFunction(ctx, dbName, key); };
      this.Tools.randomNumber = Tools.randomNumber;
    });

    const user = new User.User(this.Tools.readDB, this.Tools.writeDB);

    this.User.getData =  user.getData ;
    this.User.updateData = user.updateData;
    this.User.getItem = user.getItem;
    this.User.updateItemForce = user.updateItemForce;
    this.User.getEditWord = user.getEditWord;
    this.User.setEditWord = user.setEditWord;
    this.User.saveTemp = user.saveTemp;
    this.User.updateTemp = user.updateTemp;
    this.User.updateItem = user.updateItem;
    this.User.getConfig = user.getConfig
    this.User.setConfig = user.setConfig
    this.User.setConfigForce = user.setConfigForce
    this.User.saveConfig = user.saveConfig
    

    this.Cache.getCache = () => { return Cache.getCache(this.Tools.getDB); };
    this.Cache.nowCache = Cache.wordCache;
    this.Cache.rmCache = Cache.rmCache;
    this.Cache.addCache = Cache.addCache;

    this.Permission = new Permission.Permission(this.Tools.readDB, this.Tools.writeDB);

    this.Editor = new Editor.Editor(this.Tools.readDB, this.Tools.writeDB, this.Tools.getDB, this.Tools.removeDB, this.Cache.addCache, this.Cache.rmCache);

    this.trigger = {
      trigger: trigger.trigger,
      addTrigger: trigger.addTrigger,
      rmTrigger: trigger.rmTrigger
    };

    this.statement = {
      statement: statement.statement,
      rmStatement: statement.rmStatement,
      addStatement: statement.addStatement
    };
  }
}