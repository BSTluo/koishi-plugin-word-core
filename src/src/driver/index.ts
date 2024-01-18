import { Context } from 'koishi';
import { parsStart } from './src';
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

  async start(session: Session) {
    // this.ctx.inject(['word'], async ctx => {
    if (!session.content) { return; }
    const q: string = session.content;

    const wordCache = await this.word.cache.getCache();
    const matchList: matchType = {};

    let matchedString: string | undefined;
    let list = wordCache.hasKey[q];

    if (!wordCache.hasKey[q])
    {
      // 找到这个触发词对应的词库，并开始解析
      matchedString = Object.keys(wordCache.hasKey).find(regText => {

        // 获取输入替换列表
        let list = Object.keys(this.word.trigger.trigger);

        // 遍历获取被替换的词
        for (let repKey of list)
        {
          const thisTemp = this.word.trigger.trigger[repKey];
          
          for (let repReg of thisTemp.reg)
          {
            regText = regText.replace(repKey, repReg);
            const reg = new RegExp(`^${regText}$`, 'g');
            if (reg.test(q))
            {
              if (!matchList[thisTemp.id]) { matchList[thisTemp.id] = []; }
              const matchString: string[] = q.match(reg) as string[];

              matchList[thisTemp.id].concat(matchString);
              return true;
            }
          }
        }

      });

      list = (matchedString) ? wordCache.hasKey[q] : [];
    }
    if (!list) { return; }
    if (list.length <= 0) { return; }

    // 挑选一个词库
    const item = list[this.word.tools.randomNumber(0, list.length)];

    // 读取那个词库
    const wordData = await this.word.editor.readWord(item);

    // 获取那个词条对应的全部回答
    const questionList = wordData.data[q];

    const message = await parsStart(questionList, wordData, this.word, session, matchList);

    return message;
    // });
  }
}
