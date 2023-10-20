// 编辑词库
import * as wordTools from '..';
import { wordSaveData } from '../..';

export class Editor {
  readDB: wordTools.readDBType;
  writeDB: wordTools.writeDBType;
  getDB: wordTools.getDBType;
  removeDB: wordTools.removeDBType;
  constructor(readDB: wordTools.readDBType, writeDB: wordTools.writeDBType, getDB: wordTools.getDBType, removeDB: wordTools.removeDBType) {
    this.readDB = readDB;
    this.writeDB = writeDB;
    this.getDB = getDB;
    this.removeDB = removeDB;
  }

  // 读取词库
  private async readWord(name: string): Promise<wordSaveData> {
    return await this.readDB('wordData', name) as wordSaveData;
  }

  // 更新词库
  private async updateWord(name: string, data: wordSaveData) {
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
   *  删除词库
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

  // 设置属性
  private async setWordKeyValue(name: string, key: keyof wordSaveData, value: wordSaveData[typeof key]) {
    if (!(await this.getWordList()).includes(name)) { return '无此词库'; }
    const wordData = await this.readWord(name);

    if (key == "author") { wordData.author = value as wordSaveData["author"]; }
    if (key == "data") { wordData.data = value as wordSaveData["data"]; }
    if (key == "saveDB") { wordData.saveDB = value as wordSaveData["saveDB"]; }

    this.updateWord(name, wordData);
  }

  // 查询属性
  private async readWordKeyValue(name: string, key: keyof wordSaveData): Promise<wordSaveData[typeof key]> {
    if (!(await this.getWordList()).includes(name)) { return '无此词库'; }
    const wordData = await this.readWord(name);

    return wordData[key];
  }


  /**
   * 设置存储格
   * @param name 目标词库名
   * @param cell 存储格名
   */
  async setSaveCell(name: string, cell: string) {
    await this.setWordKeyValue(name, 'saveDB', cell);
  }

  /**
   * 重置存储格
   * @param name 目标词库名
   */
  async resetSaveCell(name: string) {
    await this.setWordKeyValue(name, 'saveDB', "default");
  }

  /**
   * 读取存储格子
   * @param name 目标词库名
   */
  async readSaveCell(name: string) {
    return await this.readWordKeyValue(name, 'saveDB');
  }

  // 更新作者
  private async updateAuthor(name: string, authorList: string[]) {
    await this.setWordKeyValue(name, 'author', authorList);
  }

  // 读取作者
  async setAuthor(name: string) {
    return await this.readWordKeyValue(name, 'author');
  }

  // 增加作者
  // 减少作者
  
  // 添加词条
  // 删除词条

  // 查找词条

  // 云端下载
  // 云端上传
}