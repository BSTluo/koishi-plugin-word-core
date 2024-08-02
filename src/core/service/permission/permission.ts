import * as wordTools from '../index';
import { allType } from '../../index';

export class Permission {
  private readDB: wordTools.readDBType;
  private writeDB: wordTools.writeDBType;

  constructor(readDB: wordTools.readDBType, writeDB: wordTools.writeDBType) {
    this.readDB = readDB;
    this.writeDB = writeDB;
  }

  /**
   * 为某人添加权限
   * @param uid 被操作者uid
   * @param newPermission 权限树
   * @returns 
   */
  async add(uid: string, newPermission: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }
    if (permissionData.permission.includes(newPermission)) { return '已存在此权限'; }
    permissionData.permission.push(newPermission);

    return await this.writeDB('wordUserConfig', uid, permissionData as unknown as allType);
  }

  /**
   * 删除某人的权限
   * @param uid 被操作者uid
   * @param permission 权限树
   * @returns 
   */
  async rm(uid: string, permission: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }

    const index = permissionData.permission.indexOf(permission);

    if (index <= -1) { return '不存在此权限'; }

    permissionData.permission.splice(index, 1);

    return await this.writeDB('wordUserConfig', uid, permissionData as unknown as allType);
  }

  /**
   * 判断某人是否拥有某权限
   * @param uid 查询目标uid
   * @param permission 权限树
   * @returns 
   */
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

  /**
   * 查看某人的全部权限
   * @param uid 被操作者uid
   * @returns 权限树
   */
  async all(uid: string) {
    const permissionData = await this.readDB('wordUserConfig', uid) as unknown as Record<string, string[]>;
    if (!permissionData.permission) { permissionData.permission = []; }
    return permissionData.permission;
  }

  // 增加权限组？

  // 减少权限组？
}