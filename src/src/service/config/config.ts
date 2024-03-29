// 编辑词库
import { allType, settingTypeValue } from '../..';
import * as wordTools from '../index';

export class Config {
  private readDB: wordTools.readDBType;
  private writeDB: wordTools.writeDBType;
  private getDB: wordTools.getDBType;
  private removeDB: wordTools.removeDBType;
  private addCache: wordTools.addCacheType;
  private rmCache: wordTools.rmCacheType;
  private refreshCache: wordTools.cacheRefreshType;

  constructor(tools: wordTools.ToolsFunction, cache: wordTools.CacheFunction) {
    this.readDB = tools.readDB;
    this.writeDB = tools.writeDB;
    this.getDB = tools.getDB;
    this.removeDB = tools.removeDB;
    this.addCache = cache.addCache;
    this.rmCache = cache.rmCache;
    this.refreshCache = cache.cacheRefresh;
  }

  /**
   * 获取配置
   * @param key 配置的键
   * @returns 
   */
  async getConfig(key: string) {
    const readData = await this.readDB('wordCoreConfig', key);

    let out: settingTypeValue;
    if (Object.keys(readData).length === 0)
    {
      out = {};
    } else
    {

      out = readData as settingTypeValue;
    }
    return out;
  }
  /**
   * 更新(新建)配置
   * @param key 配置的键
   * @param value 配置的值
   * @returns 
   */
  async updateConfig(key: string, value: settingTypeValue) {
    return await this.writeDB('wordCoreConfig', key, value as allType);
  }
}

// export type getConfigType = (key: string) => Promise<settingTypeValue>;
// export type updateConfigType = (key: string, value: settingTypeValue) => Promise<boolean>;

// export interface configFunction {
//   getConfig: getConfigType;
//   updateConfig: updateConfigType;
// }
