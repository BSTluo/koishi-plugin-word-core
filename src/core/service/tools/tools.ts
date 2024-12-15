import { Context, Random } from "koishi";
import { allType, recycleBinList, wordData, wordUserConfig, wordUserPackData, wordUserTemp } from "../..";

// 读取库
export const readDBFunction = async (ctx: Context, dbName: dbNameList, key: string): Promise<allType> =>
{
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0) { return {}; }
  return readObjTemp[0].data as allType;
};

// 保存库
export const writeDBFunction = async (ctx: Context, dbName: dbNameList, key: string, newData: allType): Promise<boolean> =>
{
  const readObjTemp = await ctx.database.get(dbName, key);
  if (readObjTemp.length <= 0)
  {

    await ctx.database.create(dbName, { id: key, data: newData } as unknown as wordUserPackData | wordData | recycleBinList | wordUserConfig | wordUserTemp);
    return true;
  } else
  {
    await ctx.database.set(dbName, key, { data: newData });
    return true;
  }
};

export const getDBFunction = async (ctx: Context, dbName: dbNameList) =>
{
  const dbData = await ctx.database.get(dbName, { id: { $regex: /^[\s\S]+$/ } });

  const data/*: dbCache*/ = {
    idList: dbData.map(v =>
    {
      return v.id;
    }),
    dataList: dbData.map((v) =>
    {
      const temp = v.data as allType;
      return temp;
    })
  };

  return data;
};

export const removeDBFunction = async (ctx: Context, dbName: dbNameList, key: string) =>
{
  ctx.database.remove(dbName, key);
};

/**
 * 获取一个随机数
 * @param minNumber 随机数下限
 * @param maxNumber 随机数上限
 * @returns 
 */
const random = new Random(() => Math.random());

export const randomNumber = (minNumber: number, maxNumber: number): number =>
{
  if (minNumber > maxNumber)
  {
    return Math.floor(Math.random() * (minNumber - maxNumber + 1)) + maxNumber;
  } else
  {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }
};

export let url = '';

type dbNameList = 'wordUserPackData' | 'wordData' | 'recycleBinList' | 'wordUserConfig' | 'wordUserTemp' | 'wordCoreConfig';

export type readDBType = (dbName: dbNameList, key: string) => Promise<allType>;
export type writeDBType = (dbName: dbNameList, key: string, data: allType) => Promise<boolean>;
export type getDBType = (dbName: dbNameList) => Promise<{ idList: string[], dataList: allType[]; }>;
export type removeDBType = (dbName: dbNameList, key: string) => Promise<void>;
export type randomNumberType = (minNumber: number, maxNumber: number) => number;

export interface ToolsFunction
{
  readDB: readDBType;
  writeDB: writeDBType;
  getDB: getDBType;
  removeDB: removeDBType;
  randomNumber: randomNumberType;
  url: string;
}