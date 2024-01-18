import { Context } from "koishi";
import { allType, recycleBinList, wordData, wordUserConfig, wordUserPackData } from "../..";

// 读取库
export const readDBFunction = async (ctx: Context, dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string): Promise<allType> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) { return {}; }
  return readObjTemp[0].data as allType;
};

// 保存库
export const writeDBFunction = async (ctx: Context, dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, newData: allType): Promise<boolean> => {
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) {

    await ctx.database.create(dbName, { id: key, data: newData } as unknown as wordUserPackData | wordData | recycleBinList | wordUserConfig);
    return true;
  } else {
    await ctx.database.set(dbName, key, { data: newData });
    return true;
  }
};

export const getDBFunction = async (ctx: Context, dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => {

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

export const removeDBFunction = async (ctx: Context, dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => {
  ctx.database.remove(dbName, key);
};

export const randomNumber = (minNumber: number, maxNumber: number): number => {
  return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
};

export type readDBType = (dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<allType>;
export type writeDBType = (dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: allType) => Promise<boolean>;
export type getDBType = (dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') => Promise<{ idList: string[], dataList: allType[]; }>;
export type removeDBType = (dbName: 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => Promise<void>;
export type randomNumberType = (minNumber: number, maxNumber: number) => number;

export interface ToolsFunction {
  readDB: readDBType;
  writeDB: writeDBType;
  getDB: getDBType;
  removeDB: removeDBType;
  randomNumber: randomNumberType;
}