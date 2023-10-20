// 编辑词库
import * as wordTools from '..';
import { wordData } from '../..';

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
  private async readWord(name: string): Promise<wordData> {
    return await this.readDB('wordData', name);
  }

  // 更新词库
  private async updateWord(name: string, data: wordData) {
    return await this.writeDB('wordData', name, data);
  }

  // 写入数据到回收站
  private async writeRecycleBin(name: string, data: wordData) {
    return await this.writeDB('recycleBinList', name, data);
  }

  // 读一个回收站词库内容
  private async readRecycleBin(name: string): Promise<wordData> {
    return await this.readDB('recycleBinList', name);
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

  /**
   * 设置存储格
   * @param name 被修改的词库名
   * @param cell 存储格名
   */
  async setSaveCell(name: string, cell: string) {
    const wordData = await this.readWord(name);
    wordData.data.saveDB = cell;
    this.updateWord(name, wordData);
  }

  /**
   * 重置存储格
   * @param name 被修改的词库名
   */
  async resetSaveCell(name: string) {
    this.setSaveCell(name, '默认');
  }

  // 读取作者
  // 更新作者

  // 添加作者

  // 添加词条
  // 删除词条

  // 查找词条

  // 云端下载
  // 云端上传
}