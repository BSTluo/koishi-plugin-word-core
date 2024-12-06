import { readDBType, writeDBType } from "../index";
import { allType, settingType, settingTypeValue, wordUserConfig, wordUserTemp } from "../../index";

export class User
{
  private readDBTools: readDBType;
  private writeDBTools: writeDBType;

  constructor(readDBTools: readDBType, writeDBTools: writeDBType)
  {
    this.readDBTools = readDBTools;
    this.writeDBTools = writeDBTools;
  }

  // private tempData: Record<string, Record<string, Record<string, number>>> = {};

  /**
   * 获取用户背包数据
   * @param uid 
   * @returns 背包数据
   */
  async getData(uid: string): Promise<Record<string, Record<string, number | string[]>>>
  {
    const data = await this.readDBTools('wordUserPackData', uid);

    const a = data as Record<string, Record<string, number>>;

    return a;
  }

  /**
   * 保存数据为用户数据
   * @param uid 用户id
   * @param data 完整用户数据
   * @returns 
   */
  async updateData(uid: string, data: Record<string, Record<string, number | string[]>>): Promise<boolean>
  {
    const backData = await this.writeDBTools('wordUserPackData', uid, data);
    return backData;
  }

  /**
   * 获取用户背包数据
   * @param uid 用户id
   * @param cell 存储格
   * @param itemName 物品名称
   * @returns 数量
   */
  async getItem(uid: string, cell: string, itemName: string): Promise<null | number | string[]>
  {
    const data = await this.getData(uid);

    if (!data[cell]) { return null; }
    if (!data[cell][itemName]) { return null; }

    return data[cell][itemName];
  }

  /**
   * 强制保存物品数量(一般不使用)
   * @param uid 用户id
   * @param cell 存储格
   * @param itemName 物品名称
   * @param itemData 数量
   * @returns 
   */
  async updateItem(uid: string, cell: string, itemName: string, itemData: number | string[]): Promise<boolean>
  {
    const data = await this.getData(uid);
    if (!data[cell]) { data[cell] = {}; }
    data[cell][itemName] = itemData;
    return await this.updateData(uid, data);
  }

  /**
   * 获取用户编辑指针
   * @param uid 用户id
   * @returns 
   */
  async getEditWord(uid: string)
  {
    const userConfig = await this.readDBTools('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!userConfig.nowEdit) { userConfig.nowEdit = ['default']; }
    return userConfig.nowEdit[0];
  }

  /**
   * 修改编辑目标
   * @param uid 用户id
   * @param newDB 编辑目标
   * @returns 
   */
  async setEditWord(uid: string, newDB: string)
  {
    const userConfig = await this.readDBTools('wordUserConfig', uid) as unknown as Record<string, string[]>;
    userConfig.nowEdit = [newDB];
    return await this.writeDBTools('wordUserConfig', uid, userConfig as unknown as allType);
  }

  private configTempData: Record<string, settingType> = {};

  /**
   * 在配置中读取设置
   * @param uid 
   * @returns 
   */
  async getConfig(uid: string): Promise<settingType>
  {
    let data: settingType;
    // 如果有缓存则输出缓存
    if (this.configTempData.hasOwnProperty(uid))
    {
      data = this.configTempData[uid];
    } else
    {
      data = await this.readDBTools('wordUserTemp', uid) as settingType;
    }

    const a = data;
    this.configTempData[uid] = a;
    return this.configTempData[uid];
  }

  // 对某一项进行键值对设置
  async setConfig(uid: string, key: string, value: settingTypeValue): Promise<void>
  {
    const configData = await this.getConfig(uid);
    configData[key] = value;
    this.configTempData[uid] = configData;
  }

  // 强制对某一项进行键值对设置
  async setConfigForce(uid: string, key: string, value: settingTypeValue): Promise<void>
  {
    const configData = await this.getConfig(uid);
    configData[key] = value;
    this.configTempData[uid] = configData;
    const ok = await this.saveUserConfig(uid, configData);
    if (ok)
    {
      delete this.configTempData[uid];
    } else
    {
      return;
    }
  }

  // 保存设置
  async saveConfig(): Promise<boolean>
  {
    const errList: Record<string, settingType> = {};

    for (const data in this.configTempData)
    {
      const bl = await this.saveUserConfig(data, this.configTempData[data]);
      if (!bl)
      {
        errList[data] = this.configTempData[data];
      }
    }
    this.configTempData = errList;
    if (JSON.stringify(this.configTempData) == "{}")
    {
      return true;
    } else
    {
      return false;
    }
  }

  // 存储某用户的数据
  private async saveUserConfig(uid: string, data: settingType): Promise<boolean>
  {
    const backData = await this.writeDBTools('wordUserTemp', uid, data);
    return backData;
  }
}
