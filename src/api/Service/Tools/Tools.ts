import { Context } from "koishi";

// 读取库
export const readDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string): Promise<any> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) { return {}; }
  return readObjTemp[0];
};

// 保存库
export const writeDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: any): Promise<boolean> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) {
    await ctx.database.create(dbName, {
      id: key,
      data: data
    });
    return true;
  } else {
    await ctx.database.set(dbName, key, data);
    return true;
  }
};
/*
export interface dbCache {
  idList: string[]
  dataList: Record<string, string>[] | wordSaveData[]
}
*/
export const getDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => {

  const data/*: dbCache*/ = {
    idList: await ctx.database.get(dbName, { id: { $regex: /^[\s\S]+$/ } }, ['id']),
    dataList: await ctx.database.get(dbName, { id: { $regex: /^[\s\S]+$/ } }, ['data'])
  };

  return data;
};

export type readDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<any>;
export type writeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: any) => Promise<boolean>;
export type getDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => any;

export interface ToolsFunction {
  readDB: readDBType;
  writeDB: writeDBType;
  getDB: getDBType;
}