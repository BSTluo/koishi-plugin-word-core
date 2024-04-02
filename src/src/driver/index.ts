import { Context } from 'koishi';
import { parsStart, saveItemDataTemp, wordDataInputType } from './src';
import { word } from '../word';
import { Session } from 'koishi';

export const inject = {
  require: ['word']
};

export type matchType = Record<string, string[]>;

export class wordDriver {
  private ctx: Context;
  private word: word;

  constructor(word: word, ctx: Context) {
    this.ctx = ctx;
    this.word = word;
  }

  /**
   * 开始解析当前的对话对象
   * @param session 当前对话对象
   * @returns 
   */
  async start(session: Session | wordDataInputType) {
    // this.ctx.inject(['word'], async ctx => {
    if (!session.content) { return; }
    let q: string = session.content;
    const wordCache = await this.word.cache.getCache();

    const matchList: matchType = {};

    let matchedString: string | undefined;

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

    if (!wordCache.hasKey[q])
    {
      // 找到这个触发词对应的词库，并开始解析
      matchedString = Object.keys(wordCache.hasKey).find(regText => {

        // 获取输入替换列表
        const triggerList = Object.keys(this.word.trigger.trigger);
        // 遍历获取被替换的词
        for (const repKey of triggerList)
        {
          const thisTemp = this.word.trigger.trigger[repKey];

          let regTextTemp: string = regText;

          for (const repReg of thisTemp.reg)
          {
            regTextTemp = regTextTemp.replaceAll(repKey, repReg);

            const reg = new RegExp(`^${regTextTemp}$`, 'g');
            const regTemp = q.match(reg);

            if (!regTemp) { continue; }

            regTemp.forEach(element => {
              const reg2 = new RegExp(`^${regTextTemp}$`);
              if (!matchList[thisTemp.id]) { matchList[thisTemp.id] = []; }
              const matchString: string[] = element.match(reg2) as string[];

              const list = matchString.slice(1, matchString.length);
              matchList[thisTemp.id] = matchList[thisTemp.id].concat(list);
              // console.log(matchList[thisTemp.id])
            });

            return true;
          }
        }
      });

      if (matchedString)
      {
        q = matchedString;
        list = wordCache.hasKey[q];
      }
    }
    if (!list) { return; }
    if (list.length <= 0) { return; }

    // 获取过滤当前群组过滤的库
    let primitiveList: string[] = list;
    const killWordListTemp = (await this.word.config.getConfig('filtration')) as unknown as Record<string, string[]>;

    const guildId = session.channelId;
    const killWordList = (killWordListTemp[guildId]) ? killWordListTemp[guildId] : [];

    let overPrimitiveList: string[] = [];

    primitiveList.forEach(e => {
      if (killWordList.includes(e))
      {
        return;
      } else
      {
        overPrimitiveList.push(e);
      }
    });

    const witchWordDB = this.word.tools.randomNumber(0, list.length - 1);

    const parsedList: number[] = [];
    let witchWord = 0;
    // 挑选一个词库，且不重复 
    let needPar = '';

    const parOne = async () => {
      const item = list[witchWordDB];
      // 读取那个词库
      const wordData = await this.word.editor.readWord(item);

      // 获取那个词条对应的全部回答
      const questionList = wordData.data[q];
      if (!questionList) { return; }

      do
      {
        if (parsedList.length >= questionList.length) { break; }
        witchWord = this.word.tools.randomNumber(0, questionList.length - 1);
      } while (parsedList.includes(witchWord));
      parsedList.push(witchWord);

      needPar = questionList[witchWord];
      const message = await parsStart(needPar, wordData, this.word, session, matchList);

      return message;
    };

    try
    {
      const abc = await parOne();

      if (!abc) { return; }
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
      const ok2 = await this.word.user.saveTemp();

      if (ok && ok2)
      {
        return a;
      } else
      {
        return ' [word-core] 数据保存失败';
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
        if (msg) { return msg; }
        return;
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
        const ok2 = await this.word.user.saveTemp();

        if (ok && ok2)
        {
          if (msg) { return msg; }
          return;
        } else
        {
          if (msg) { return ' [word-core] 数据保存失败，并且' + msg; }
          return ' [word-core] 数据保存失败';
        }
      }

      // 执行后立即终止，不保存数据，并且进入下次解析
      if (errorType.startsWith('next'))
      {
        const abc = await parOne();
        if (!abc) { return; }
        const a = abc.message;

        // console.log(a)
        const needSaveObj = abc.data;
        // 获取物品
        const needSave = needSaveObj.item;
        if (!needSave)
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
        if (!needSaveConfig)
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
        const ok2 = await this.word.user.saveTemp();

        return a;
      }
    }

  }
}
