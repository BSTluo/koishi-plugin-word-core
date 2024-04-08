// 编辑词库
import * as wordTools from '../index';
import { wordSaveData } from '../../index';
import FormData from 'form-data';
import axios from 'axios';
import { createWriteStream } from 'fs';

export class Editor {
  private readDB: wordTools.readDBType;
  private writeDB: wordTools.writeDBType;
  private getDB: wordTools.getDBType;
  private removeDB: wordTools.removeDBType;
  private addCache: wordTools.addCacheType;
  private rmCache: wordTools.rmCacheType;
  private refreshCache: wordTools.cacheRefreshType;
  private getCache: wordTools.getCacheType;
  private tools: wordTools.ToolsFunction;

  constructor(tools: wordTools.ToolsFunction, cache: wordTools.CacheFunction) {
    this.readDB = tools.readDB;
    this.writeDB = tools.writeDB;
    this.getDB = tools.getDB;
    this.removeDB = tools.removeDB;
    this.addCache = cache.addCache;
    this.rmCache = cache.rmCache;
    this.refreshCache = cache.cacheRefresh;
    this.getCache = cache.getCache;
    this.tools = tools;
  }

  /**
   * 读取词库
   * @param name 目标词库
   * @returns 结果
   */
  public async readWord(name: string): Promise<wordSaveData> {
    const readData = await this.readDB('wordData', name);

    let out: wordSaveData;
    if (Object.keys(readData).length === 0)
    {
      out = {
        name: name,
        saveDB: 'default',
        author: [],
        data: {}
      };
    } else
    {

      out = readData as wordSaveData;
    }
    return out;
  }

  /**
   * 更新词库
   * @param name 目标词库
   * @param data 词库数据
   * @returns 结果
   */
  public async updateWord(name: string, data: wordSaveData) {
    return await this.writeDB('wordData', name, data);
  }

  // 写入数据到回收站
  private async writeRecycleBin(name: string, data: wordSaveData) {
    return await this.writeDB('recycleBinList', name, data);
  }

  // 读一个回收站词库内容
  private async readRecycleBin(name: string): Promise<wordSaveData> {
    return await this.readDB('recycleBinList', name) as wordSaveData;
  }

  /**
   * 读取回收站列表
   * @returns idList
   */
  async getRecycleBinList(): Promise<string[]> {
    const list = await this.getDB('recycleBinList');
    return list.idList;
  }

  /**
   * 读取普通词库列表
   * @returns idList
   */
  async getWordList(): Promise<string[]> {
    const list = await this.getDB('wordData');
    return list.idList;
  }

  /**
   * 删除词库
   * @param name 需要删除的词库名
   * @returns 结果
   */
  async removeWord(name: string): Promise<"词库列表不存在此词库" | "ok"> {
    const wordList = await this.getWordList();
    if (!wordList.includes(name)) { return '词库列表不存在此词库'; }

    const data = await this.readWord(name);
    this.writeRecycleBin(name, data);
    this.removeDB('wordData', name);

    return 'ok';
  }

  /**
   * 恢复词库
   * @param name 被恢复的词库名
   * @returns 返回结果
   */
  async restoreWord(name: string): Promise<"回收站不存在此词库" | "ok"> {
    const recycleBinList = await this.getRecycleBinList();
    if (!recycleBinList.includes(name)) { return '回收站不存在此词库'; }

    const data = await this.readRecycleBin(name);
    this.updateWord(name, data);
    await this.removeDB('recycleBinList', name);

    return 'ok';
  }

  /**
   * 设置属性
   * @param name 目标词库
   * @param key author|data|saveDB之一
   * @param value 设置为的值
   * @returns 结果
   */
  private async setWordKeyValue(name: string, key: keyof wordSaveData, value: wordSaveData[typeof key]) {
    if (!(await this.getWordList()).includes(name)) { return '无此词库'; }
    const wordData = await this.readWord(name);

    if (key == "author") { wordData.author = value as wordSaveData["author"]; }
    if (key == "data") { wordData.data = value as wordSaveData["data"]; }
    if (key == "saveDB") { wordData.saveDB = value as wordSaveData["saveDB"]; }

    return await this.updateWord(name, wordData);
  }

  /**
   * 查询属性
   * @param name 目标词库 
   * @param key author|data|saveDB之一
   * @returns 结果
   */
  private async readWordKeyValue(name: string, key: keyof wordSaveData): Promise<wordSaveData[typeof key]> {
    if (!(await this.getWordList()).includes(name)) { return '无此词库'; }
    const wordData = await this.readWord(name);
    return wordData[key];
  }

  /**
   * 设置存储格
   * @param name 目标词库名
   * @param cell 存储格名
   * @param uid 操作者uid
   */
  async setSaveCell(name: string, cell: string, uid: string) {
    const author = await this.isAuthor(name, uid);
    if (!author) { return '你不是作者'; }
    return await this.setWordKeyValue(name, 'saveDB', cell);
  }

  /**
   * 重置存储格
   * @param name 目标词库名
   * @param uid 操作者uid
   */
  async resetSaveCell(name: string, uid: string) {
    const author = await this.isAuthor(name, uid);
    if (!author) { return '你不是作者'; }
    return await this.setWordKeyValue(name, 'saveDB', "default");
  }

  /**
   * 读取存储格子
   * @param name 目标词库名
   * @param uid 操作者uid
   */
  async readSaveCell(name: string, uid: string) {
    // const author = await this.isAuthor(name, uid);
    // if (!author) { return '你不是作者'; }
    return await this.readWordKeyValue(name, 'saveDB') as string;
  }

  /**
   * 更新作者
   * @param name 目标词库名
   * @param authorList 更新作者列表
   */
  private async updateAuthor(name: string, authorList: string[]) {
    await this.setWordKeyValue(name, 'author', authorList);
  }

  /**
   * 读取作者
   * @param name 目标词库名
   * @returns 
   */
  async getAuthor(name: string): Promise<string[]> {
    return await this.readWordKeyValue(name, 'author') as string[];
  }

  /**
   * 增加作者
   * @param name 目标词库名
   * @param uid 操作者uid
   * @param authorID 新增uid
   * @returns 
   */
  async addAuthor(name: string, uid: string, authorID: string) {
    const author = await this.getAuthor(name);

    if (!(await this.isAuthor(name, uid))) { return '您不是作者，无权操作'; }
    if (!author.includes(authorID))
    {
      author.push(authorID);
      await this.updateAuthor(name, author);
      return '添加完成';
    } else
    {
      return '此作者已存在';
    }
  }

  /**
   * 减少作者
   * @param name 目标词库名
   * @param uid 操作者uid
   * @param authorID 去除uid
   * @returns 
   */
  async removeAuthor(name: string, uid: string, authorID: string) {
    let author = await this.getAuthor(name);

    if (!(await this.isAuthor(name, uid))) { return '您不是作者，无权操作'; }
    if (!author.includes(authorID))
    {
      return '此作者不存在';
    } else
    {
      author = author.splice(author.indexOf(name), 1);
      await this.updateAuthor(name, author);
      return '已删除作者';
    }
  }

  /**
   * 是否有作者权限
   * @param name 目标词库名
   * @param authorID 是否含有此uid
   * @returns 
   */
  async isAuthor(name: string, authorID: string) {
    const author = await this.getAuthor(name);

    if (!author.includes(authorID))
    {
      return false;
    } else
    {
      return true;
    }
  }

  /**
   * 添加词条
   * @param name 目标词库
   * @param uid 操作者uid
   * @param q 触发词
   * @param a 回答
   * @returns 
   */
  async addWordItem(name: string, uid: string, q: string, a: string) {
    const list = await this.getWordList();
    if (!list.includes(name))
    {
      const dataTemp: Record<string, string[]> = {};
      dataTemp[q] = [a];

      this.addCache(q, name);
      if (await this.updateWord(name, {
        name: name,
        author: [uid],
        data: dataTemp,
        saveDB: 'default'
      }))
      {
        return 1;
      }
    }

    const wordData = await this.readWord(name);
    if (!(await this.isAuthor(name, uid))) { return '您不是作者，无权操作'; }

    if (!Object.keys(wordData.data).includes(q))
    {

      wordData.data[q] = [a];
      this.addCache(q, name);
    } else
    {
      wordData.data[q].push(a);
    }
    const index = wordData.data[q].length;
    await this.updateWord(name, wordData);

    return index;
  }

  /**
   * 删除词条
   * @param name 目标词库
   * @param uid 操作者uid
   * @param q 触发词
   * @param a 删除序号(从1开始，为'all'时删除此触发)
   * @returns 
   */
  async rmWordItem(name: string, uid: string, q: string, a: "all" | number) {
    const wordData = await this.readWord(name);
    if (!(await this.isAuthor(name, uid))) { return '您不是作者，无权操作'; }

    if (!Object.keys(wordData.data).includes(q))
    {
      return '此触发词不存在';
    } else
    {
      if (a == 'all')
      {
        delete wordData.data[q];
        this.rmCache(q, name);
      } else
      {
        if (a > wordData.data[q].length) { return '超过触发词的回答上限'; }
        wordData.data[q].splice(a - 1, 1);
        if (wordData.data[q].length == 0)
        {
          delete wordData.data[q];
          this.rmCache(q, name);
        }
      }
    }
    await this.updateWord(name, wordData);
    return "over";
  }

  /**
   * 查找词条（查询某触发词所在的词库）
   * @param q 触发词 
   * @returns 
   */
  async getQuestion(q: string) {
    const hasKey = this.getCache().hasKey;

    const questionList = Object.keys(hasKey);

    const matchedString = questionList.find(regText => {
      const reg = new RegExp(`^${regText}$`);
      return reg.test(q);
    });
    if (!matchedString)
    {
      return [];
    } else
    {
      return hasKey[q];
    }
  }

  private res: Record<string, Record<string, string>> = {};

  // 获取云端插件序列
  async getCloudWordList() {
    const fetchDataTemp = await fetch(`${this.tools.url}/getList`);
    const fetchData = await fetchDataTemp.json();
    this.res = fetchData;
  }

  // 云端下载
  async getCloudWord(name: string) {
    if (JSON.stringify(this.res) == "{}") { await this.getCloudWordList(); }
    const pluginData = this.res[name];
    if (!pluginData) { return; }

    const authorId = pluginData.authorId;
    const pluginName = pluginData.name;
    // const authorName = pluginData.author;

    const fetchDataTemp = await fetch(`${this.tools.url}/getPlugin/${authorId}/${pluginName}.json`);
    const fetchData = await fetchDataTemp.json();
    this.updateWord(name, fetchData);

    this.getCache();
  }

  // 云端上传
  async updateCloudWord(pluginData: pluginData) {
    const formData = new FormData();

    const a = await this.readWord(pluginData.dbName);
    if (a.author.length == 0) { return; }

    const file = Buffer.from(JSON.stringify(a));
    formData.append('file', file, { filename: `${pluginData.name}.json` });
    formData.append('tag', JSON.stringify(pluginData.tag));

    Object.keys(pluginData).forEach(v => {
      const a = v as pluginDataKeys;
      if (v == 'file' || v == 'tag')
      {
        return;
      }
      {
        formData.append(a, pluginData[a]);
      }
    });

    await axios.post(`${this.tools.url}/newPlugin`, formData);
  }
}

type pluginData = {
  tag: string[],
  author: string,
  name: string,
  wiki: string,
  authorId: string,
  dbName: string,
  descriptor: string,
  version: string,
  icon: string;
};

type pluginDataKeys = keyof pluginData;
