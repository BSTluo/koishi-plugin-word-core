// 编辑词库
import * as wordTools from '..';

export class Editor {
  readDB: wordTools.readDBType;
  writeDB: wordTools.writeDBType;
  
  constructor(readDB: wordTools.readDBType, writeDB: wordTools.writeDBType) {
    this.readDB = readDB;
    this.writeDB = writeDB;
  }

  // 读取词库
  async readWord(name:string) {
    return await this.readDB('wordData',name)
  }

  // 更新词库
  async updateWord(name:string, data:any) {
    return await this.writeDB('wordData',name, data)
  }

  // 删除词库
  // 恢复词库

  // 读取作者
  // 更新作者

  // 添加作者

  // 添加词条
  // 删除词条

  // 查找词条

  // 云端下载
  // 云端上传
}