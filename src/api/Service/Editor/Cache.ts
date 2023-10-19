import { getDBType } from "..";

export const wordCache: Cache = {
  hasKey: {}
};

export interface Cache {
  hasKey: Record<string, string[]>;
}

export const getCache = async (getDBTools: getDBType) => {
  const { idList, dataList } = await getDBTools('wordData');
  dataList.forEach((item: Record<string, string>, index: number) => {
    Object.keys(item).forEach(v => {
      if (!wordCache.hasKey[v]) { wordCache.hasKey[v] = []; }
      wordCache.hasKey[v].push(idList[index]);
    });
  });

  return wordCache;
};

export type getCacheType = () => Promise<Cache>;
export interface CacheFunction {
  getCache: getCacheType;
}
