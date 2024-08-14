import { Context } from 'koishi';
import { parsStart, saveItemDataTemp, wordDataInputType } from './src';
import { word } from '../word';
import { Session } from 'koishi';

export const inject = {
  require: ['word']
};

export type matchType = Record<string, string[]>;

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
    const wordCache = await this.word.cache.getCache();

    const matchList: matchType = {};

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

    let over = false;

    if (!wordCache.hasKey[q])
    {
      // 找到这个触发词对应的词库，并开始解析
      const getCanReplace = () =>
      {
        while (!over)
        {
          const oldQ = q;

          for (let e of triggerList)
          {
            const nowTrigger = this.word.trigger.trigger[e];
            const regList = nowTrigger.reg;

            for (let regStr of regList)
            {
              const reg = new RegExp(regStr);

              const matchResult = q.match(reg);
              // console.log('q', q);
              // console.log('reg', reg);
              // console.log('matchResult', matchResult);

              if (!matchResult)
              {
                const wordQuestionDB = Object.keys(wordCache.hasKey);

                for (let i = 0; i < wordQuestionDB.length; i++)
                {
                  const element = wordQuestionDB[i];
                  if (q.match(RegExp('^' + element + '$'))) { list = wordCache.hasKey[element]; /* session.content = element;*/ q = element; return; }
                }
              } else
              {
                if (!matchList[nowTrigger.id]) { matchList[nowTrigger.id] = []; }
                matchList[nowTrigger.id] = matchList[nowTrigger.id].concat(matchResult[1]);
                q = q.replace(reg, e);
                // session.content = q;
                if (wordCache.hasKey[q]) { list = wordCache.hasKey[q]; return; }
              }
            }
          }

          if (oldQ === q)
          {
            over = true;
            return;
          }
        }
      };
      getCanReplace();
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
      for (let i of contentList)
      {
        try
        {
          let abc = await parsStart(i, wordData, this.word, session, matchList);

          if (!abc) { continue; }
          const a = abc.message;
          // console.log(abc)

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
          // console.log(err);
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
}
