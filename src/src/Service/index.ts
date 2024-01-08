import { Context } from "koishi";
import * as Tools from './tools/Tools';
import * as User from './user/User';
import * as Cache from "./editor/cache";
import * as Editor from './editor/editor';
import * as Permission from './permission/Permission';
import * as trigger from "../extend/trigger";
import { wordSaveData } from "..";
import * as statement from "../extend/statement";

export * from './tools/Tools';
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
    // 这样写你就不需要手动给 ctx 赋值了
    this.ctx = ctx;

    this.ctx.inject(['database'], async ctx => {
      this.Tools.readDB = (dbName, key) => { return Tools.readDBFunction(ctx, dbName, key); };
      this.Tools.writeDB = (dbName, key, data) => { return Tools.writeDBFunction(ctx, dbName, key, data); };
      this.Tools.getDB = (dbName) => { return Tools.getDBFunction(ctx, dbName); };
      this.Tools.removeDB = async (dbName, key) => { return Tools.removeDBFunction(ctx, dbName, key); };
      this.Tools.randomNumber = Tools.randomNumber;
    });

    this.User.getData = (uid) => { return User.getData(this.Tools.readDB, uid); };
    this.User.updateData = (uid, data) => { return User.updateData(this.Tools.writeDB, uid, data); };
    this.User.getItem = (uid, cell, item) => { return User.getItem(this.Tools.readDB, uid, cell, item); };
    this.User.updateItem = (uid, cell, itemName, amount) => { return User.updateItem(this.Tools.readDB, this.Tools.writeDB, uid, cell, itemName, amount); };
    this.User.getEditWord = (uid) => { return User.getEditWord(this.Tools.readDB, uid); };
    this.User.setEditWord = (uid, newDB) => { return User.setEditWord(this.Tools.readDB, this.Tools.writeDB, uid, newDB); };


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