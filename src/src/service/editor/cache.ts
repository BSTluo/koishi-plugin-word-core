import { getDBType } from "../index";
import { wordSaveData } from "../../index";

export let wordCache: WordCache = {
  hasKey: {},
  idList: []
};

export interface WordCache
{
  hasKey: Record<string, string[]>;
  idList: string[];
}

export function getCache()
{
  return wordCache;
};

export const cacheRefresh = async (getDBTools: getDBType) =>
{
  wordCache = {
    hasKey: {},
    idList: []
  };

  const { dataList, idList } = await getDBTools('wordData');
  const dataListTemp = dataList as wordSaveData[];
  wordCache.idList = idList;

  dataListTemp.forEach((item: wordSaveData) =>
  {
    const itemTemp = item.data;
    const itemName = item.name;

    Object.keys(itemTemp).forEach(v =>
    {
      if (!wordCache.hasKey[v]) { wordCache.hasKey[v] = []; }
      wordCache.hasKey[v].push(itemName);
    });
  });

  return wordCache;
};

/**
 * 标识某触发词属于某词库
 * @param q 触发词
 * @param wordName 属于的词库
 */
export const addCache = (q: string, wordName: string) =>
{
  if (Object.keys(wordCache.hasKey).includes(q))
  {
    wordCache.hasKey[q].push(wordName);
  } else
  {
    wordCache.hasKey[q] = [wordName];
  }
};

// 取消标识某问题属于某词库
export const rmCache = (q: string, wordName: string) =>
{
  if (Object.keys(wordCache.hasKey).includes(q))
  {
    const index = wordCache.hasKey[q].indexOf(wordName);
    wordCache.hasKey[q].splice(index, 1);
    if (wordCache.hasKey[q].length <= 0) { delete wordCache.hasKey[q]; }
  }
};

export type getCacheType = () => WordCache;
export type rmCacheType = (q: string, wordName: string) => void;
export type addCacheType = (q: string, wordName: string) => void;
export type cacheRefreshType = () => Promise<WordCache>;

export interface CacheFunction
{
  getCache: getCacheType;
  nowCache: WordCache;
  rmCache: rmCacheType;
  addCache: addCacheType;
  cacheRefresh: cacheRefreshType;
}
