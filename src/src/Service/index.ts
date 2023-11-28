import { Context } from "koishi";
import * as Tools from './Tools/Tools';
import * as User from './User/User';
import * as Cache from "./Editor/Cache";
import * as Editor from './Editor/Editor';
import * as trigger from "../extend/trigger";
import { wordSaveData } from "..";

export * from './Tools/Tools';
export * from './Editor/Cache';

export * from './Editor/Cache';

export const inject = {
  require: ['database']
};

export class wordService {
  private ctx: Context;

  public Tools: Tools.ToolsFunction = {} as Tools.ToolsFunction;

  public User: User.UserFunction = {} as User.UserFunction;

  public Cache: Cache.CacheFunction = {} as Cache.CacheFunction;

  public Editor: Editor.Editor = {} as Editor.Editor;

  public trigger: trigger.triggerType = trigger.trigger;

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

    this.Editor = new Editor.Editor(this.Tools.readDB, this.Tools.writeDB, this.Tools.getDB, this.Tools.removeDB, this.Cache.addCache, this.Cache.rmCache);
    // this.Editor = {

    //   /**
    //   * 读取词库
    //   * @param name 目标词库
    //   * @returns 结果
    //   */
    //   readWord: async (name: string): Promise<wordSaveData> => {
    //     return editor.readWord(name);
    //   },

    //   /**
    //   * 读取回收站列表
    //   * @returns idList
    //   */
    //   getRecycleBinList: async (): Promise<string[]> => {
    //     return editor.getRecycleBinList();
    //   },

    //   /**
    //   * 读取普通词库列表
    //   * @returns idList
    //   */
    //   getWordList: async (): Promise<string[]> => {
    //     return editor.getWordList();
    //   },

    //   /**
    //   * 删除词库
    //   * @param name 需要删除的词库名
    //   * @returns 结果
    //   */
    //   removeWord: async (name: string): Promise<"词库列表不存在此词库" | "ok"> => {
    //     return editor.removeWord(name);
    //   },

    //   /**
    //   * 恢复词库
    //   * @param name 被恢复的词库名
    //   * @returns 返回结果
    //   */
    //   restoreWord: async (name: string): Promise<"回收站不存在此词库" | "ok"> => {
    //     return editor.restoreWord(name);
    //   },

    //   /**
    //    * 设置存储格
    //    * @param name 目标词库名
    //    * @param cell 存储格名
    //    * @param uid 操作者uid
    //    */
    //   setSaveCell: async (name: string, cell: string, uid: string) => {
    //     return editor.setSaveCell(name, cell, uid);
    //   },

    //   /**
    //    * 重置存储格
    //    * @param name 目标词库名
    //    * @param uid 操作者uid
    //    */
    //   resetSaveCell: async (name: string, uid: string) => {
    //     return editor.resetSaveCell(name, uid);
    //   },

    //   /**
    //    * 读取存储格子
    //    * @param name 目标词库名
    //    * @param uid 操作者uid
    //    */
    //   readSaveCell: async (name: string, uid: string) => {
    //     return editor.readSaveCell(name, uid);
    //   },

    //   /**
    //    * 读取作者
    //    * @param name 目标词库名
    //    * @returns 
    //    */
    //   getAuthor: async (name: string): Promise<string[]> => {
    //     return editor.getAuthor(name);
    //   },

    //   /**
    //    * 增加作者
    //    * @param name 目标词库名
    //    * @param uid 操作者uid
    //    * @param authorID 新增uid
    //    * @returns 
    //    */
    //   addAuthor: async (name: string, uid: string, authorID: string) => {
    //     return editor.addAuthor(name, uid, authorID);
    //   },

    //   /**
    //    * 减少作者
    //    * @param name 目标词库名
    //    * @param uid 操作者uid
    //    * @param authorID 去除uid
    //    * @returns 
    //    */
    //   removeAuthor: async (name: string, uid: string, authorID: string) => {
    //     return editor.removeAuthor(name, uid, authorID);
    //   },

    //   /**
    //    * 是否有作者权限
    //    * @param name 目标词库名
    //    * @param authorID 是否含有此uid
    //    * @returns 
    //    */
    //   isAuthor: async (name: string, authorID: string) => {
    //     return editor.isAuthor(name, authorID);
    //   },

    //   /**
    //    * 添加词条
    //    * @param name 目标词库
    //    * @param uid 操作者uid
    //    * @param q 触发词
    //    * @param a 回答
    //    * @returns 
    //    */
    //   addWordItem: async (name: string, uid: string, q: string, a: string) => {
    //     return editor.addWordItem(name, uid, q, a);
    //   },

    //   /**
    //    * 删除词条
    //    * @param name 目标词库
    //    * @param uid 操作者uid
    //    * @param q 触发词
    //    * @param a 删除序号(从1开始，为'all'时删除此触发)
    //    * @returns 
    //    */
    //   rmWordItem: async (name: string, uid: string, q: string, a: "all" | number) => {
    //     return editor.rmWordItem(name, uid, q, a);
    //   },

    //   /**
    //    * 查找词条（查询某触发词所在的词库）
    //    * @param q 触发词 
    //    * @returns 
    //    */
    //   getQuestion: async (q: string) => {
    //     return editor.getQuestion(q);
    //   }
    // };
  }
}