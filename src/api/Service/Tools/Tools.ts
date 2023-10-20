import { Context } from "koishi";
import { DBTypeList, allType, recycleBinList, wordData, wordSaveData, wordUserConfig, wordUserData } from "../..";

// 读取库
export const readDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string): Promise<allType> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) { return {}; }
  return readObjTemp[0] as unknown as allType;
};

// 保存库
export const writeDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, newData: allType): Promise<boolean> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) {
    await ctx.database.create(dbName, newData as unknown as wordUserData | wordData | recycleBinList | wordUserConfig);
    return true;
  } else {
    await ctx.database.set(dbName, key, newData);
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
    dataList: dataListOrigin.map((v) => {
      const temp = v.data as allType;
      return temp;
    })
  };

  return data;
};

export const removeDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => {
  ctx.database.remove(dbName, key);
};

export type readDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<allType>;
export type writeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: allType) => Promise<boolean>;
export type getDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => Promise<{ idList: string[], dataList: allType[]; }>;
export type removeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<void>;

export interface ToolsFunction {
  readDB: readDBType;
  writeDB: writeDBType;
  getDB: getDBType;
  removeDB: removeDBType;
}