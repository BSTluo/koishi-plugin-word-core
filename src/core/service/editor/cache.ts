import { getDBType } from "../index";
import { wordSaveData } from "../../index";
import { trigger } from "../../extend/trigger";

export let wordCache: WordCache = {
  hasKey: {},
  idList: [],
  grammarKeys: [],
  normalKeys: []
};

export interface WordCache
{
  hasKey: Record<string, string[]>;
  idList: string[];
  grammarKeys: string[];
  normalKeys: string[];
}

export function getCache()
{
  return wordCache;
};

export const cacheRefresh = async (getDBTools: getDBType) =>
{
  const triggerKeys = Object.keys(trigger);

  wordCache = {
    hasKey: {},
    idList: [],
    grammarKeys: [],
    normalKeys: []
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
      if (!wordCache.hasKey[v].includes(itemName)) wordCache.hasKey[v].push(itemName);

      for (let a of triggerKeys)
      {
        if (v.includes(a))
        {
          wordCache.grammarKeys.push(v);
          return;
        }
      }

      wordCache.normalKeys.push(v);
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

  const triggerKeys = Object.keys(trigger);

  for (let a of triggerKeys)
  {
    if (q.includes(a))
    {
      wordCache.grammarKeys.push(q);
      return;
    }
  }

  wordCache.normalKeys.push(q);
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

  wordCache.normalKeys = wordCache.normalKeys.filter(item => item !== q);
  wordCache.grammarKeys = wordCache.grammarKeys.filter(item => item !== q);
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
