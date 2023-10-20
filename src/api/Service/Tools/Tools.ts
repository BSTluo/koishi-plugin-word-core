import { Context } from "koishi";
import { DBTypeList, recycleBinList, wordData, wordSaveData, wordUserConfig, wordUserData } from "../..";

// 读取库
export const readDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string): Promise<wordSaveData | Record<string, string[]>> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) { return {}; }
  return readObjTemp[0] as unknown as Record<string, string[]> | wordSaveData;
};

// 保存库
export const writeDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, newData: wordSaveData | Record<string, string>): Promise<boolean> => {
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
      const temp = v.data as wordSaveData | Record<string, string[]>;
      return temp;
    })
  };

  return data;
};

export const removeDBFunction = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => {
  ctx.database.remove(dbName, key);
};

export type readDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<wordSaveData | Record<string, string[]>>;
export type writeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: any) => Promise<boolean>;
export type getDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => Promise<{ idList: string[], dataList: (wordSaveData | Record<string, string[]>)[]; }>;
export type removeDBType = (dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<void>;

export interface ToolsFunction {
  readDB: readDBType;
  writeDB: writeDBType;
  getDB: getDBType;
  removeDB: removeDBType;
}