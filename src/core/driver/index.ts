import { Context } from 'koishi';
import { parsStart, saveItemDataTemp, wordDataInputType } from './src';
import { word } from '../word';
import { Session } from 'koishi';
import { wordSaveData } from '..';
import { triggerType } from '../extend/trigger';

export const inject = {
  require: ['word']
};


export interface wordParConfig
{
  /**
   * 需要解析的词库名字，可空
   */
  name?: string;

  /**
   * 数据保存到的背包存储格位置
   */
  saveDB: string;

  /**
   * 此库的作者id列表，可空
   */
  author?: string[];

  /**
   * 词库的问答配置，可空
   * {
   *  触发词: ["回复a","回复b",......,"回复c"]
   * }
   */
  data?: Record<string, string[]>;
}

export type matchType = Record<string, string[]>;

function parseTriggrtString(a:string, b:string, mapping:triggerType) {
  // 获取所有占位符的 key
  const placeholderKeys = Object.keys(mapping);
  // 构造一个正则，用来匹配 b 中的占位符（注意：对 key 做了转义）
  const placeholderPattern = new RegExp(
    placeholderKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g'
  );

  // 解析 b，分离出文字部分与占位符部分
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = placeholderPattern.exec(b)) !== null) {
    if (match.index > lastIndex) {
      // 文字部分不再做转义，直接当做正则拼接
      segments.push({ type: 'literal', value: b.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'placeholder', value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < b.length) {
    segments.push({ type: 'literal', value: b.slice(lastIndex) });
  }

  // 构造最终的正则表达式字符串，同时记录占位符对应的捕获组位置
  let regexStr = '';
  let groupIndex = 0;
  // 用于记录每个占位符对应的 id 以及捕获组编号
  const placeholderGroupMap: { id: string; group: number; }[] = [];

  segments.forEach(seg => {
    if (seg.type === 'literal') {
      // 注意：直接拼接文字部分，不做转义，
      // 这样可以使得 b 中的 "\\d" 保持为 "\d"（匹配数字）的含义
      regexStr += seg.value;
    } else if (seg.type === 'placeholder') {
      const config = mapping[seg.value];
      if (!config || !config.reg || !config.reg[0]) {
        throw new Error(`占位符 ${seg.value} 对应的正则配置不存在`);
      }
      // 取出该占位符对应的正则片段（假定只有一个捕获组）
      const snippet = config.reg[0];
      regexStr += snippet;
      groupIndex += 1;
      placeholderGroupMap.push({ id: config.id, group: groupIndex });
    }
  });

  // 构造完整正则：要求匹配整个字符串
  const finalRegex = new RegExp('^' + regexStr + '$');
  // 调试时可打印查看构造的正则
  // console.log("构造的正则：", finalRegex);

  const matchResult = finalRegex.exec(a);
  if (!matchResult) {
    // 若不匹配，返回空对象
    return {};
  }

  // 根据捕获组的编号，提取结果到最终的对象中
  const result: matchType = {};
  placeholderGroupMap.forEach(({ id, group }) => {
    if (!result[id]) result[id] = [];
    result[id].push(matchResult[group]);
  });

  return result;
}

export class wordDriver
{
  private ctx: Context;
  private word: word;

  constructor(word: word, ctx: Context)
  {
    this.ctx = ctx;
    this.word = word;
  }

  /**
   * 开始解析当前的对话对象
   * @param session 当前对话对象
   * @returns 
   */
  async start(session: Session | wordDataInputType, callback: (str: string | null | undefined) => void)
  {
    // this.ctx.inject(['word'], async ctx => {

    if (!session.content) { return; }

    let q: string = session.content;

    const wordCache = this.word.cache.getCache();

    let matchList: matchType = {};

    // let matchedString: string | undefined;

    // // 获取过滤当前群组过滤的库
    // let primitiveList = wordCache.hasKey[q];
    // const killWordListTemp = (await this.word.config.getConfig('filtration')) as unknown as Record<string, string[]>;

    // const guildId = session.guildId;
    // const killWordList = (killWordListTemp[guildId]) ? killWordListTemp[guildId] : [];

    // let overPrimitiveList: string[] = [];

    // primitiveList.forEach(e => {
    //   if (killWordList.includes(e))
    //   {
    //     return;
    //   } else
    //   {
    //     overPrimitiveList.push(e);
    //   }
    // });

    // 过滤过群组的群组列表
    let list = wordCache.hasKey[q];

    // 获取输入替换列表
    const triggerList = Object.keys(this.word.trigger.trigger);

    if (!wordCache.normalKeys.includes(q))
    {
      const testMsgGrammar = () =>
      {
        let item = '';

        for (let a of wordCache.grammarKeys)
        {
          item = a;
          for (const key of triggerList)
          {
            const reg = this.word.trigger.trigger[key].reg[0]; // 获取正则表达式字符串
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义正则特殊字符
            item = item.replace(new RegExp(escapedKey, 'g'), `${reg}`);

            const msgReg = new RegExp(`^${item}$`);

            if (msgReg.test(q))
            {
              list = wordCache.hasKey[a];

              return a;
            }

          }
        }
      };

      const grammarMssg = testMsgGrammar();

      if (!list) { return; }
      if (list.length <= 0) { return; }
      if (!grammarMssg) { return; }

      matchList = parseTriggrtString(q, grammarMssg, this.word.trigger.trigger);

      q = grammarMssg;
      // 找到这个触发词对应的词库，并开始解析
      // const getCanReplace = () =>
      // {
      //   while (!over)
      //   {
      //     const oldQ = q;

      //     for (let e of triggerList)
      //     {
      //       const nowTrigger = this.word.trigger.trigger[e];
      //       const regList = nowTrigger.reg;

      //       for (let regStr of regList)
      //       {
      //         const reg = new RegExp(regStr);

      //         const matchResult = q.match(reg);
      //         // console.log('q', q);
      //         // console.log('reg', reg);
      //         // console.log('matchResult', matchResult);

      //         if (!matchResult)
      //         {
      //           const wordQuestionDB = Object.keys(wordCache.hasKey);

      //           for (let i = 0; i < wordQuestionDB.length; i++)
      //           {
      //             const element = wordQuestionDB[i];
      //             if (q.match(RegExp('^' + element + '$'))) { list = wordCache.hasKey[element]; /* session.content = element;*/ q = element; return; }
      //           }
      //         } else
      //         {
      //           if (!matchList[nowTrigger.id]) { matchList[nowTrigger.id] = []; }
      //           matchList[nowTrigger.id] = matchList[nowTrigger.id].concat(matchResult[1]);
      //           q = q.replace(reg, e);
      //           // session.content = q;
      //           if (wordCache.hasKey[q]) { list = wordCache.hasKey[q]; return; }
      //         }
      //       }
      //     }

      //     if (oldQ === q)
      //     {
      //       over = true;
      //       return;
      //     }
      //   }
      // };
      // getCanReplace();
    }

    if (!list) { return; }
    if (list.length <= 0) { return; }

    // 获取过滤当前群组过滤的库
    let primitiveList: string[] = list;
    const killWordListTemp = (await this.word.config.getConfig('filtration')) as unknown as Record<string, string[]>;

    const channelId = session.channelId;
    const killWordList = (killWordListTemp[channelId]) ? killWordListTemp[channelId] : [];

    let overPrimitiveList: string[] = [];

    primitiveList.forEach(e =>
    {
      if (killWordList.includes(e))
      {
        return;
      } else
      {
        overPrimitiveList.push(e);
      }
    });

    const witchWordDB = this.word.tools.randomNumber(0, overPrimitiveList.length - 1);

    const parsedList: number[] = [];
    let witchWord = 0;
    // 挑选一个词库，且不重复 
    let needPar = '';

    const parOne = async (): Promise<string | null | undefined> =>
    {

      if (!q) { return; }
      const item = overPrimitiveList[witchWordDB];

      // 读取那个词库
      const wordData = await this.word.editor.readWord(item);

      // 获取那个词条对应的全部回答
      const questionList = wordData.data[q];

      if (!questionList) { return; }

      do
      {
        if (parsedList.length >= questionList.length) { return; }
        witchWord = this.word.tools.randomNumber(0, questionList.length - 1);
      } while (parsedList.includes(witchWord));
      parsedList.push(witchWord);

      needPar = questionList[witchWord];

      const contentList = needPar.split('(换)');
      // console.log('aaa', matchList);
      for (let i of contentList)
      {
        try
        {
          let abc = await this.parMsgPrivate(i, wordData, session, matchList);

          // console.log(abc);
          if (!abc) { continue; }
          const a = abc.message;

          const needSaveObj = abc.data;
          // 获取物品

          const needSave = needSaveObj.item;

          if (needSave)
          {
            for (let uid in needSave)
            {
              const saveDBList = needSave[uid];

              for (let saveDB in saveDBList)
              {
                const itemNameList = saveDBList[saveDB];

                for (let itemName in itemNameList)
                {
                  const num = itemNameList[itemName];
                  await this.word.user.updateItem(uid, saveDB, itemName, num);
                }
              }
            }
          }

          const needSaveConfig = needSaveObj.userConfig;
          if (needSaveConfig)
          {
            for (let uid in needSaveConfig)
            {
              for (let key in needSaveConfig[uid])
              {
                await this.word.user.setConfig(uid, key, needSaveConfig[uid][key]);
              }
            }
          }

          const ok = await this.word.user.saveConfig();
          // const ok2 = await this.word.user.saveTemp();

          if (ok)
          {
            // if (ok) {
            callback(a);
            continue;
          } else
          {
            callback(' [word-core] 数据保存失败');
            continue;
          }
        } catch (err: any)
        {
          console.log(err);
          const errorType = err.message;
          if (!errorType) { return err; }
          const msg = errorType.split(':')[1];

          // 执行后立刻终止，并且不保存数据
          if (errorType.startsWith('kill'))
          {
            // console.log(msg)
            if (msg) { callback(msg); continue; }
            continue;
          }

          // 执行后立即终止，但是保存数据
          if (errorType.startsWith('end'))
          {
            const needSaveObj = saveItemDataTemp[q];
            // 获取物品
            const needSave = needSaveObj.item;
            if (needSave)
            {
              for (let uid in needSave)
              {
                const saveDBList = needSave[uid];

                for (let saveDB in saveDBList)
                {
                  const itemNameList = saveDBList[saveDB];

                  for (let itemName in itemNameList)
                  {
                    const num = itemNameList[itemName];
                    await this.word.user.updateItem(uid, saveDB, itemName, num);
                  }
                }
              }
            }

            const needSaveConfig = needSaveObj.userConfig;
            if (needSaveConfig)
            {
              for (let uid in needSaveConfig)
              {
                for (let key in needSaveConfig[uid])
                {
                  await this.word.user.setConfig(uid, key, needSaveConfig[uid][key]);
                }
              }
            }

            const ok = await this.word.user.saveConfig();
            // const ok2 = await this.word.user.saveTemp();

            // if (ok && ok2)
            if (ok)
            {
              if (msg) { callback(msg); continue; }
              continue;
            } else
            {
              if (msg) { callback(' [word-core] 数据保存失败，并且' + msg); continue; }
              callback(' [word-core] 数据保存失败');
              continue;
            }
          }

          // 执行后立即终止，不保存数据，并且进入下次解析
          if (errorType.startsWith('next'))
          {
            return await parOne();
          }
        }
      }
    };

    await parOne();
  }

  /**
   * 词库本体解析文本
   * @param msg 需要解析的文本
   * @param wordSaveData 文本所在的词库配置，{data: xxx, author: xxx, saveDB: xxx, name: xxx}
   * @param session koishi的上下文Session，或是session的关键元素
   * @param matchList 输入匹配列表，可空
   * @returns 返回解析结果
   */
  private async parMsgPrivate(msg: string, wordSaveData: wordSaveData, session: Session | wordDataInputType, matchList?: matchType)
  {
    return await parsStart(msg, wordSaveData, this.word, session, matchList);
  }

  /**
     * 词库解析文本
     * @param msg 需要解析的文本
     * @param wordParConfig 文本所在的词库配置，{data?: xxx, author?: xxx, saveDB: xxx, name?: xxx}
     * @param session koishi的上下文Session，或是session的关键元素
     * @param matchList 输入匹配列表，可空
     * @returns 返回解析结果
     */
  async parMsg(msg: string, wordParConfig: wordParConfig, session: Session | wordDataInputType, matchList?: matchType): Promise<string | undefined | null>
  {
    try
    {
      let abc = await this.parMsgPrivate(msg, wordParConfig as wordSaveData, session, matchList);

      if (!abc) { return; }
      const a = abc.message;

      const needSaveObj = abc.data;
      // 获取物品

      const needSave = needSaveObj.item;

      if (needSave)
      {
        for (let uid in needSave)
        {
          const saveDBList = needSave[uid];

          for (let saveDB in saveDBList)
          {
            const itemNameList = saveDBList[saveDB];

            for (let itemName in itemNameList)
            {
              const num = itemNameList[itemName];
              await this.word.user.updateItem(uid, saveDB, itemName, num);
            }
          }
        }
      }

      const needSaveConfig = needSaveObj.userConfig;
      if (needSaveConfig)
      {
        for (let uid in needSaveConfig)
        {
          for (let key in needSaveConfig[uid])
          {
            await this.word.user.setConfig(uid, key, needSaveConfig[uid][key]);
          }
        }
      }

      const ok = await this.word.user.saveConfig();
      // const ok2 = await this.word.user.saveTemp();

      if (ok)
      {
        // if (ok) {
        return a;
      } else
      {
        return (' [word-core] 数据保存失败');

      }
    } catch (err: any)
    {
      console.log(err);
      const errorType = err.message;
      if (!errorType) { return err; }
      const msg = errorType.split(':')[1];

      // 执行后立刻终止，并且不保存数据
      if (errorType.startsWith('kill'))
      {
        // console.log(msg)
        if (msg) { return msg; }
        return;
      }

      // 执行后立即终止，但是保存数据
      // if (errorType.startsWith('end'))
      // {
      //   const needSaveObj = saveItemDataTemp[q];
      //   // 获取物品
      //   const needSave = needSaveObj.item;
      //   if (needSave)
      //   {
      //     for (let uid in needSave)
      //     {
      //       const saveDBList = needSave[uid];

      //       for (let saveDB in saveDBList)
      //       {
      //         const itemNameList = saveDBList[saveDB];

      //         for (let itemName in itemNameList)
      //         {
      //           const num = itemNameList[itemName];
      //           await this.word.user.updateItem(uid, saveDB, itemName, num);
      //         }
      //       }
      //     }
      //   }

      //   const needSaveConfig = needSaveObj.userConfig;
      //   if (needSaveConfig)
      //   {
      //     for (let uid in needSaveConfig)
      //     {
      //       for (let key in needSaveConfig[uid])
      //       {
      //         await this.word.user.setConfig(uid, key, needSaveConfig[uid][key]);
      //       }
      //     }
      //   }

      //   const ok = await this.word.user.saveConfig();
      //   // const ok2 = await this.word.user.saveTemp();

      //   // if (ok && ok2)
      //   if (ok)
      //   {
      //     if (msg) { return msg; }
      //     return;
      //   } else
      //   {
      //     if (msg) { return ' [word-core] 数据保存失败，并且' + msg; }
      //     return ' [word-core] 数据保存失败';
      //   }
      // }

      // 执行后立即终止，不保存数据，并且进入下次解析
      if (errorType.startsWith('next'))
      {
        return '';
      }
    }
  }
}
