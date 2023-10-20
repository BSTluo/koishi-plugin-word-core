import { getDBType } from "..";
import { wordSaveData } from "../..";

export const wordCache: Cache = {
  hasKey: {}
};

export interface Cache {
  hasKey: Record<string, string[]>;
}

export const getCache = async (getDBTools: getDBType) => {
  const { idList, dataList } = await getDBTools('wordData');
  const dataListTemp = dataList as wordSaveData[];

  dataListTemp.forEach((item: wordSaveData, index: number) => {
    const itemTemp = item.data;

    Object.keys(itemTemp).forEach(v => {
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
