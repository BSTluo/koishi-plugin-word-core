import { Context, Session } from "koishi";
import { statement, statusMsg } from "../../extend/statement";
import { matchType } from "..";
import { word } from "../../word";
import { wordSaveData } from "../..";
import { error } from "console";

export interface chatFunctionType {
  args: string[],
  matchs: matchType;
  wordData: wordSaveData;
  parPack: typeParPack;
}

// 切换一个词条进行解释（不会切换到已解析的词条）
// data为返回的值
type typeNext = (data?: string) => {
  status: 'next';
  data: string|undefined;
};

const next: typeNext = (data?: string) => {
  return { status: 'next', data: data };
};

// 杀死此回复词
// data为返回的值
type typeEnd = (data?: string) => {
  status: 'end';
  data: string|undefined;
};

const end: typeEnd = (data?: string) => {
  return { status: 'end', data: data };
};

// 结束此回复词
// data为返回的值
type typeKill = (data?: string) => {
  status: 'kill';
  data: string|undefined;
};

const kill: typeKill = (data?: string) => {
  return { status: 'kill', data: data };
};

// 词库切换函数
type typeParPack = {
  next: typeNext;
  end: typeEnd;
  kill: typeKill;
};

const parPack: typeParPack = {
  next: next,
  end: end,
  kill: kill
};

let funcPackKeys = Object.keys(statement);

export const parsStart = async (questionList: string[], wordData: wordSaveData, word: word, session: Session, matchList?: matchType) => {
  const randomNumber = word.tools.randomNumber;

  funcPackKeys = Object.keys(statement);
  const getRandQuestion = (questionList: string[]) => {
    const num = randomNumber(0, questionList.length - 1);

    return questionList[num];
  };

  const temp = getRandQuestion(questionList);
  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
  const tree = getTree(temp);

  // 再进行树的解析
  const msg = await parseTrees(tree, session, wordData, !matchList ? {} : matchList, false);
  // console.log(msg)
  return msg;
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

const parseTrees = async (inData: any[], session: Session, wordData: wordSaveData, matchList: matchType, isFunction: boolean): Promise<string> => {
  // 遍历最深层字符串，解析后返回结果，重复运行
  for (let i = 0; i < inData.length; i++)
  {

    if (Array.isArray(inData[i]))
    {
      inData[i] = await parseTrees(inData[i], session, wordData, matchList, true); // 递归调用处理嵌套数组
    }
  }

  if (!isFunction)
  {
    return inData.join('');
  } else
  {

    const reload = inData.join('');
    const newFunArr = reload.split(':');
    // which是语法包的头
    const which = newFunArr[0];

    const toInData: chatFunctionType = {
      args: newFunArr.slice(1),
      matchs: matchList,
      wordData: wordData,
      parPack: parPack
    };

    // newFunArr 是解析得到的语法字符串
    // overPar 运行完成语法包后的的字符串
    if (funcPackKeys.includes(which))
    {
      const overPar = await parStatement(which, toInData, session);

      return overPar;
    } else
    {
      return newFunArr.join('');
    }
  }
};

// 调用词库语法
const parStatement = async (which: string, toInData: chatFunctionType, session: Session<never, never, Context>) => {
  const str: string | void | statusMsg = await statement[which](toInData, session);
  if (typeof str == "object")
  {
    const status = str.status;
    if (status == 'kill' || status == 'end' || status == 'next') { 
      const errorMsg = `${status}${(str.data) ? ':' + str.data : ''}`
      throw new Error(errorMsg); 
    }
  } else
  {
    return (str) ? str : '';
  }
  return '';
};