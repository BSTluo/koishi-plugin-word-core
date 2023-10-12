import { Context } from "koishi";

// 读取库
export const readDB = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) => {
  const readObjTemp = await ctx.database.get(dbName, key)
  if (readObjTemp.length <= 0) { return {} }
  return readObjTemp[0]
}

// 保存库
export const writeDB = async (ctx: Context, dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: any) => {
  const readObjTemp = await ctx.database.get(dbName, key)
  if (readObjTemp.length <= 0) {
    await ctx.database.create(dbName, {
      id: key,
      data: data
    })
  } else {
    await ctx.database.set(dbName, key, data)
  }
}

