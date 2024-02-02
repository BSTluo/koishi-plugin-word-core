import { Context, Session } from "koishi";
import { statement } from "../../extend/statement";
import { matchType } from "..";
import { word } from "../../word";
import { wordSaveData } from "../..";

export interface chatFunctionType {
  args: string[],
  matchs: matchType;
  wordData: wordSaveData;
}

let funcPackKeys = Object.keys(statement);

export const parsStart = async (questionList: string[], wordData: wordSaveData, word: word, session: Session, matchList?: matchType) => {
  const randomNumber = word.tools.randomNumber;

  funcPackKeys = Object.keys(statement);
  const getRandQuestion = (questionList: string[]) => {
    const num = randomNumber(0, questionList.length - 1);

    return questionList[num];
  };

  let temp = getRandQuestion(questionList);
  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
  const tree = getTree(temp);
  // console.log(tree);

  // 再进行树的解析

  const msg = await parseTrees(tree, session, wordData, !matchList ? {} : matchList);
  const ok = await word.user.saveTemp();
  if (ok)
  {
    return msg;
  } else
  {
    return ' [word-core] 数据保存失败';
  }
};

const getTree = (str: string): any[] => {
  let parseStr = str;

  const par = () => {
    const tempArr: any[] = [];
    let index = 0;

    while (parseStr.length > 0)
    {
      const v = parseStr[0];
      parseStr = parseStr.slice(1);

      if (v === '(')
      {
        index++;
        // parseStr = parseStr.slice(0);
        tempArr[index] = par();
        index++;
      } else if (v === ')')
      {
        return tempArr;
        // } else if (v === ':') {
        //   index++;
        // } else {
      } else
      {
        if (!tempArr[index]) { tempArr[index] = ''; }
        tempArr[index] += v;
      }
    }

    return tempArr;
  };

  const a = par();
  return a;
};

const parseTrees = async (inData: any[], session: Session, wordData: wordSaveData, matchList: matchType): Promise<string> => {
  // 遍历最深层字符串，解析后返回结果，重复运行
  for (let i = 0; i < inData.length; i++)
  {
    if (Array.isArray(inData[i]))
    {
      inData[i] = await parseTrees(inData[i], session, wordData, matchList); // 递归调用处理嵌套数组
    }
  }
  const reload = inData.join('');
  const newFunArr = reload.split(':');

  // newFunArr 是解析得到的语法字符串
  if (funcPackKeys.includes(newFunArr[0]))
  {
    const which = newFunArr[0];
    const inData: chatFunctionType = {
      args: newFunArr.slice(1),
      matchs: matchList,
      wordData: wordData
    };

    const str: string | void = await statement[which](inData, session);
    return (str) ? str : '';
  } else
  {
    return newFunArr.join('');
  }
};
