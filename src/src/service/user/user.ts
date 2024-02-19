import { readDBType, writeDBType } from "../index";
import { allType } from "../../index";

export class User {
  readDBTools: readDBType;
  writeDBTools: writeDBType;
  constructor(readDBTools: readDBType, writeDBTools: writeDBType) {
    this.readDBTools = readDBTools;
    this.writeDBTools = writeDBTools;
  }

  tempData: Record<string, Record<string, Record<string, number>>> = {};

  // 编辑用户背包数据
  async getData(uid: string): Promise<Record<string, Record<string, number>>> {
    let data;
    // 如果有缓存则输出缓存
    if (this.tempData.hasOwnProperty(uid))
    {
      data = this.tempData[uid];
    } else
    {
      data = await this.readDBTools('wordUserPackData', uid);
    }

    const a = data as Record<string, Record<string, number>>;
    this.tempData[uid] = a;
    return this.tempData[uid];
  }

  // 保存数据为用户数据
  async updateData(uid: string, data: Record<string, Record<string, number>>): Promise<boolean> {
    const backData = await this.writeDBTools('wordUserPackData', uid, data);
    return backData;
  };

  // 保存缓存
  async saveTemp(): Promise<boolean> {
    const errList: Record<string, Record<string, Record<string, number>>> = {};

    for (const data in this.tempData)
    {
      const bl = await this.updateData(data, this.tempData[data]);
      if (!bl)
      {
        errList[data] = this.tempData[data];
      }
    }
    this.tempData = errList;
    if (JSON.stringify(this.tempData) == "{}")
    {
      return true;
    } else
    {
      return false;
    }
  }

  // 保存数据到缓存
  updateTemp(uid: string, data: Record<string, Record<string, number>>): boolean {
    try
    {
      this.tempData[uid] = data;
      return true;
    } catch (err)
    {
      return false;
    }
  }

  async getItem(uid: string, cell: string, itemName: string): Promise<null | number> {
    const data = await this.getData(uid);
    if (!data[cell]) { return null; }
    if (!data[cell][itemName]) { return null; }
    return data[cell][itemName];
  };

  async updateItemForce(uid: string, cell: string, itemName: string, amount: number): Promise<boolean> {
    const data = await this.getData(uid);
    if (!data[cell]) { data[cell] = {}; }
    if (!data[cell][itemName]) { data[cell][itemName] = amount; }
    return await this.updateData(uid, data);
  };

  async updateItem(uid: string, cell: string, itemName: string, amount: number): Promise<boolean> {
    try
    {
      const data = await this.getData(uid);

      if (!data[cell]) { data[cell] = {}; }
      data[cell][itemName] = amount;

      this.tempData[uid] = data;
      return true;
    } catch (err)
    {
      return false;
    }
  };

  // 获取用户编辑指针
  async getEditWord(uid: string) {
    const userConfig = await this.readDBTools('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!userConfig.nowEdit) { userConfig.nowEdit = ['default']; }
    return userConfig.nowEdit[0];
  };

  // 修改编辑指针
  async setEditWord(uid: string, newDB: string) {
    const userConfig = await this.readDBTools('wordUserConfig', uid) as unknown as Record<string, string[]>;
    userConfig.nowEdit = [newDB];
    return await this.writeDBTools('wordUserConfig', uid, userConfig as unknown as allType);
  };
}

export type getDataType = (uid: string) => Promise<Record<string, Record<string, number>>>;
export type updateDataType = (uid: string, data: Record<string, Record<string, number>>) => Promise<boolean>;
export type getItemType = (uid: string, cell: string, itemName: string) => Promise<null | number>;
export type updateItemForceType = (uid: string, cell: string, itemName: string, amount: number) => Promise<boolean>;
export type getEditWordType = (uid: string) => Promise<string>;
export type setEditWordType = (uid: string, newDB: string) => Promise<boolean>;
export type saveTempType = () => Promise<boolean>;
export type updateTempType = (uid: string, data: Record<string, Record<string, number>>) => boolean;
export type updateItemType = (uid: string, cell: string, itemName: string, amount: number) => Promise<boolean>;

export interface UserFunction {
  getData: getDataType;
  updateData: updateDataType;
  getItem: getItemType;
  updateItemForce: updateItemForceType;
  getEditWord: getEditWordType;
  setEditWord: setEditWordType;
  saveTemp: saveTempType;
  updateTemp: updateTempType;
  updateItem: updateItemType;
}