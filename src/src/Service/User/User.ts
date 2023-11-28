import { readDBType, writeDBType } from "..";
import { allType } from "../..";

// 编辑用户背包数据
export const getData = async (readDBTools: readDBType, uid: string): Promise<Record<string, Record<string, number>>> => {
  const data = await readDBTools('wordUserPackData', uid);
  return data as Record<string, Record<string, number>>;
};

export const updateData = async (writeDBTools: writeDBType, uid: string, data: Record<string, Record<string, number>>): Promise<boolean> => {
  const backData = await writeDBTools('wordUserPackData', uid, data);
  return backData;
};

export const getItem = async (readDBTools: readDBType, uid: string, cell: string, itemName: string): Promise<null | number> => {
  const data = await getData(readDBTools, uid);
  if (!data[cell]) { return null; }
  if (!data[cell][itemName]) { return null; }
  return data[cell][itemName];
};

export const updateItem = async (readDBTools: readDBType, writeDBTools: writeDBType, uid: string, cell: string, itemName: string, amount: number): Promise<boolean> => {
  const data = await getData(readDBTools, uid);
  if (!data[cell]) { data[cell] = {}; }
  if (!data[cell][itemName]) { data[cell][itemName] = amount; }
  return await updateData(writeDBTools, uid, data);
};

// 获取用户编辑指针
export const getEditWord = async (readDBTools: readDBType, uid: string) => {
  const userConfig = await readDBTools('wordUserConfig', uid) as unknown as Record<string, string[]>;
  if (!userConfig.nowEdit) { userConfig.nowEdit = ['default']; }
  return userConfig.nowEdit[0];
};

// 修改编辑指针
export const setEditWord = async (readDBTools: readDBType, writeDBTools: writeDBType, uid: string, newDB: string) => {
  const userConfig = await readDBTools('wordUserConfig', uid) as unknown as Record<string, string[]>;
  userConfig.nowEdit = [newDB];
  return await writeDBTools('wordUserConfig', uid, userConfig as unknown as allType);
};

export type getDataType = (uid: string) => Promise<Record<string, Record<string, number>>>;
export type updateDataType = (uid: string, data: Record<string, Record<string, number>>) => Promise<boolean>;
export type getItemType = (uid: string, cell: string, itemName: string) => Promise<null | number>;
export type updateItemType = (uid: string, cell: string, itemName: string, amount: number) => Promise<boolean>;
export type getEditWordType = (uid: string) => Promise<string>;
export type setEditWordType = (uid: string, newDB: string) => Promise<boolean>;

export interface UserFunction {
  getData: getDataType;
  updateData: updateDataType;
  getItem: getItemType;
  updateItem: updateItemType;
  getEditWord: getEditWordType;
  setEditWord: setEditWordType;
}