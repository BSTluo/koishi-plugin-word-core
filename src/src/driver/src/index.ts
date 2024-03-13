import { Context, Session, capitalize } from "koishi";
import { statement, statusMsg } from "../../extend/statement";
import { matchType } from "..";
import { word } from "../../word";
import { wordSaveData } from "../..";

export interface chatFunctionType {
  args: string[],
  matchs: matchType;
  wordData: wordSaveData;
  parPack: typeParPack;
  internal: {
    saveItem: (uid: string, saveDB: string, itemName: string, number: number) => void,
    getItem: (uid: string, saveDB: string, itemName: string) => Promise<any>;
  };
}

export const saveItemDataTemp: Record<string, Record<string, Record<string, { has: number, saveDB: string; }>>[]> = {};

// 切换一个词条进行解释（不会切换到已解析的词条）
// data为返回的值
type typeNext = (data?: string) => {
  status: 'next';
  data: string | undefined;
};

const next: typeNext = (data?: string) => {
  return { status: 'next', data: data };
};

// 杀死此回复词
// data为返回的值
type typeEnd = (data?: string) => {
  status: 'end';
  data: string | undefined;
};

const end: typeEnd = (data?: string) => {
  return { status: 'end', data: data };
};

// 结束此回复词
// data为返回的值
type typeKill = (data?: string) => {
  status: 'kill';
  data: string | undefined;
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

export const parsStart = async (questionList: string, wordData: wordSaveData, word: word, session: Session, matchList?: matchType) => {
  // const randomNumber = word.tools.randomNumber;

  funcPackKeys = Object.keys(statement);
  // const getRandQuestion = (questionList: string[]) => {
  //   const num = randomNumber(0, questionList.length - 1);

  //   return questionList[num];
  // };

  // const temp = getRandQuestion(questionList);
  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
  const tree = getTree(questionList);

  if (!session.content) { return; }
  // 再进行树的解析
  saveItemDataTemp[session.content] = [{}];

  const msg = await parseTrees(word, tree, session, wordData, !matchList ? {} : matchList, false);
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

const parseTrees = async (word: word, inData: any[], session: Session, wordData: wordSaveData, matchList: matchType, isFunction: boolean): Promise<string> => {
  // 遍历最深层字符串，解析后返回结果，重复运行

  for (let i = 0; i < inData.length; i++)
  {
    if (Array.isArray(inData[i]))
    {
      const saveTemp = saveItemDataTemp[(!session.content) ? '' : session.content];

      let firstTemp = inData[i];
      saveTemp.push(saveTemp[0]);
      const getData = await parseTrees(word, firstTemp, session, wordData, matchList, true); // 递归调用处理嵌套数组

      if (getData == "[word-core]KILL")
      {
        saveTemp.pop();
        inData[i] = '';

      } else
      {
        const saveLenghtTemp = saveTemp.length;
        const saveLenght = (saveLenghtTemp > 2) ? saveLenghtTemp - 2 : 0;

        saveTemp[saveLenght] = saveTemp[saveLenght + 1];
        saveTemp.pop();

        inData[i] = getData;
      }
    }
  }

  if (!isFunction)
  {
    return inData.join('');
  } else
  {
    const saveLenghtTemp = saveItemDataTemp[(!session.content) ? '' : session.content].length;
    const nowDataTemp = saveItemDataTemp[(!session.content) ? '' : session.content][(saveLenghtTemp > 0) ? saveLenghtTemp - 1 : 0];

    const reload = inData.join('');
    const newFunArr = reload.split(':');
    // which是语法包的头
    const which = newFunArr[0];

    const toInData: chatFunctionType = {
      args: newFunArr.slice(1),
      matchs: matchList,
      wordData: wordData,
      parPack: parPack,
      internal: {
        saveItem: (uid: string, saveDB: string, itemName: string, number: number) => {
          if (!nowDataTemp[uid])
          {
            nowDataTemp[uid] = {};
          }

          nowDataTemp[uid][itemName] = {
            has: number,
            saveDB: saveDB
          };
        },

        getItem: async (uid: string, saveDB: string, itemName: string) => {
          const num = await word.user.getItem(uid, saveDB, itemName);

          if (!nowDataTemp[uid])
          {
            nowDataTemp[uid] = {};
            nowDataTemp[uid][itemName] = {
              has: (!num) ? 0 : num,
              saveDB: saveDB
            };
          }
          return nowDataTemp[uid][itemName].has;
        }
      }
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
    if (status == 'end' || status == 'next')
    {
      const errorMsg = `${status}${(str.data) ? ':' + str.data : ''}`;
      throw new Error(errorMsg);
    }
    if (status == 'kill')
    {
      return '[word-core]KILL';
    }
  } else
  {
    return (str) ? str : '';
  }
  return '';
};