import { Context } from 'koishi';
import { wordCache } from '../Service';
import { wordSaveData } from '..';

export class wordDriver {
  ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async start(q: string) {

    // 找到这个触发词对应的词库，并开始解析
    const matchedString = Object.keys(wordCache.hasKey).find(regText => {
      // 获取输入替换列表
      let list = Object.keys(this.ctx.word.trigger);

      // 遍历获取被替换的词
      for (let repKey of list) {

        for (let repReg of this.ctx.word.trigger[repKey]) {
          regText = regText.replace(repKey, repReg);
          const reg = new RegExp(`^${regText}$`);
          if (reg.test(q)) { return true; }
        }
      }

    });

    let list = (matchedString) ? wordCache.hasKey[q] : [];

    if (list.length <= 0) { return; }
    

    // 挑选一个词库
    const item = list[this.ctx.word.tools.randomNumber(0,list.length)]

    // 读取那个词库
    const wordData = await this.ctx.word.editor.readWord(item)

    // 获取那个词条对应的全部回答
    const questionList = wordData.data[q]

  }
}
