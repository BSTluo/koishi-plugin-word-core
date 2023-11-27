import * as wordTools from '..';
import { allType } from '../..';

export class Permission {
  private readDB: wordTools.readDBType;
  private writeDB: wordTools.writeDBType;
  private getDB: wordTools.getDBType;
  private removeDB: wordTools.removeDBType;

  constructor(readDB: wordTools.readDBType, writeDB: wordTools.writeDBType, getDB: wordTools.getDBType, removeDB: wordTools.removeDBType) {
    this.readDB = readDB;
    this.writeDB = writeDB;
    this.getDB = getDB;
    this.removeDB = removeDB;
  }

  // 获取权限表
  async getList(uid: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = [] }
    return permissionData.permission
  }

  // 添加权限
  async add(uid:string, newPermission:string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = [] }
    if (permissionData.permission.includes(newPermission)) { return }
    permissionData.permission.push(newPermission)

    await this.writeDB('wordUserConfig', uid, permissionData as unknown as allType)
  }

  // 减少权限

  // 判断是否拥有某权限

  // 增加权限组？

  // 减少权限组？
}