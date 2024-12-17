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

function isRegexSyntax(str: string)
{
  // 定义正则语法字符的匹配规则
  const regexSyntax = /[.*+?^${}()|[\]\\]/;

  // 第一步：初步检测是否包含正则语法字符
  if (!regexSyntax.test(str))
  {
    return false;
  }

  // 第二步：尝试解析字符串为正则表达式
  try
  {
    new RegExp(str); // 如果能成功创建正则，说明是合法的正则语法
    return true;
  } catch (e)
  {
    return false; // 无法解析为正则，说明不是完整的正则语法
  }
}

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
        if (v.includes(a) || isRegexSyntax(v))
        {
          if (!wordCache.grammarKeys.includes(v)) { wordCache.grammarKeys.push(v); }

          return;
        }
      }
      if (!wordCache.normalKeys.includes(v)) { wordCache.normalKeys.push(v); }

    });
  });
  // console.log(wordCache)
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
    if (q.includes(a) || isRegexSyntax(q))
    {
      if (!wordCache.grammarKeys.includes(q)) { wordCache.grammarKeys.push(q); }
      return;
    }
  }
  if (!wordCache.normalKeys.includes(q)) { wordCache.normalKeys.push(q); }
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
