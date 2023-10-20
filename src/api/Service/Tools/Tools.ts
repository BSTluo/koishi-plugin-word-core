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

export const getDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => {

  const idListOrigin = await ctx.database.get(dbName, { id: { $regex: /^[\s\S]+$/ } }, ['id']);
  const dataListOrigin = await ctx.database.get(dbName, { id: { $regex: /^[\s\S]+$/ } }, ['data']);

  const data/*: dbCache*/ = {
    idList: idListOrigin.map(v => {
      return v.id;
    }),
    dataList: dataListOrigin.map(v => {
      return v.data;
    })
  };

  return data;
};

export const removeDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => {
  ctx.database.remove(dbName, key);
};

export type readDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<any>;
export type writeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: any) => Promise<boolean>;
export type getDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => Promise<{ idList: string[], dataList: any; }>;
export type removeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<void>;

export interface ToolsFunction {
  readDB: readDBType;
  writeDB: writeDBType;
  getDB: getDBType;
  removeDB: removeDBType;
}