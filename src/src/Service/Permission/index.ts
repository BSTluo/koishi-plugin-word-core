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
    if (!permissionData.permission) { permissionData.permission = []; }
    return permissionData.permission;
  }

  // 添加权限
  async add(uid: string, newPermission: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }
    if (permissionData.permission.includes(newPermission)) { return '已存在此权限'; }
    permissionData.permission.push(newPermission);

    await this.writeDB('wordUserConfig', uid, permissionData as unknown as allType);
  }

  // 减少权限
  async rm(uid: string, permission: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }

    const index = permissionData.permission.indexOf(permission);

    if (index <= -1) { return '不存在此权限'; }

    permissionData.permission.splice(index, 1);

    await this.writeDB('wordUserConfig', uid, permissionData as unknown as allType);
  }

  // 判断是否拥有某权限
  async isHave(uid: string, permission: string): Promise<boolean> {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }

    if (permissionData.permission.includes(permission)) { return true; }

    const arr = permission.split('.');

    for (const node of permissionData.permission) {
      const nodeList = node.split('.');
      for (let index = 0; index < nodeList.length; index++) {
        if (nodeList[index] === '*') { return true; }
        if (nodeList[index] !== arr[index]) { break; }
      }
    }
    return false;
  }

  // 返回全部权限
  async all(uid: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }
    return permissionData.permission
  }
  
  // 增加权限组？

  // 减少权限组？
}