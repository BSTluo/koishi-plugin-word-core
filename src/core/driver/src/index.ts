import { Context, Element, Session, capitalize, is, Bot } from "koishi";
import { ifStatement, statement, statusMsg } from "../../extend/statement";
import { matchType } from "..";
import { word } from "../../word";
import { settingType, settingTypeValue, wordSaveData } from "../..";

export interface wordDataInputType
{
  username: string;
  userId: string;
  channelId: string;
  content: string;
  send?: Session['send'];
  bot?: Bot;
  event?: Session['event'];
  prompt?: Session['prompt'];
  guildId?: Session['guildId'];
}

type parTemp = {
  // item:{userid:{saveDB:{itemName:number}}}
  item: Record<string, Record<string, Record<string, number>>>,
  userConfig: Record<string, settingType>;
};

export const saveItemDataTemp: Record<string, parTemp> = {};

// 切换一个词条进行解释（不会切换到已解析的词条）
// data为返回的值
type typeNext = (data?: string) => {
  status: 'next';
  data: string | undefined;
};

const next: typeNext = (data?: string) =>
{
  return { status: 'next', data: data };
};

// 杀死此回复词
// data为返回的值
type typeEnd = (data?: string) => {
  status: 'end';
  data: string | undefined;
};

const end: typeEnd = (data?: string) =>
{
  return { status: 'end', data: data };
};

// 结束此回复词
// data为返回的值
type typeKill = (data?: string) => {
  status: 'kill';
  data: string | undefined;
};

const kill: typeKill = (data?: string) =>
{
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
let ifFuncPackKeys = Object.keys(ifStatement);

export const parsStart = async (questionList: string, wordData: wordSaveData, word: word, session: Session | wordDataInputType, matchList?: matchType): Promise<{ data: any, message: string; } | null> =>
{

  funcPackKeys = Object.keys(statement);
  ifFuncPackKeys = Object.keys(ifStatement);
  // console.log(funcPackKeys)
  // console.log(ifFuncPackKeys)

  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
  // console.log(questionList);
  const tree = getTree(questionList);
  // console.log(tree);

  if (!questionList) { return null; }

  const msg = [];
  let userData = {};
  let oldUserData = {};

  for (let needParMsg of tree)
  {
    let over;
    if (Array.isArray(needParMsg))
    {
      over = await parseTrees(questionList, word, needParMsg, session, wordData, !matchList ? {} : matchList, JSON.parse(JSON.stringify(userData)));

      if (over)
      {
        msg.push(over.message);
        oldUserData = userData;
        userData = over.data;
      } else
      {
        userData = oldUserData;
      }
    } else
    {
      msg.push(needParMsg);
    }
  }

  const msgOut = msg.join('');
  if (msgOut)
  {
    return { message: msgOut, data: userData };
  } else
  {
    return null;
  }
};

const getTree = (str: string): any[] =>
{
  let parseStr = str;

  const par = () =>
  {
    let tempArr: any[] = [];
    let index = 0;

    while (parseStr.length > 0)
    {
      const v = parseStr[0];
      parseStr = parseStr.slice(1);
      // console.log(v)
      
      if (v == '(')
      {
        if (!tempArr[index]) { tempArr[index] = []; }
        const length = tempArr[index].length;
        
        if (tempArr[index][length - 1]?.endsWith('\\'))
        {
          tempArr[index][length - 1] = tempArr[index][length - 1].slice(0, -1);
          tempArr[index][length - 1] += v;
        } else
        {
          tempArr[index].push(par());
        }
      } else if (v == ')')
      {
        if (!tempArr[index]) { tempArr[index] = []; }
        const length = tempArr[index].length;
        if (tempArr[index][length - 1]?.endsWith('\\'))
        {
          tempArr[index][length - 1] = tempArr[index][length - 1].slice(0, -1);
          tempArr[index][length - 1] += v;
        } else {
          return tempArr;
        }
      } else if (v == ':')
      {
        if (!tempArr[index]) { tempArr[index] = ['']; }
        const length = tempArr[index].length;

        if (Array.isArray(tempArr[index][length - 1]))
        {
          // console.log('1');
          index++;
        } else if ((!funcPackKeys.includes(tempArr[0][0]) && !ifFuncPackKeys.includes(tempArr[0][0])) || (tempArr[index][length - 1].endsWith('http') || tempArr[index][length - 1].endsWith('https') || tempArr[index][length - 1].endsWith('\\')))
        {
          // console.log('2');
          const lastList = tempArr[index][length - 1];
          if (Array.isArray(lastList))
          {
            tempArr[index].push(v);
          } else if (tempArr[index][length - 1].endsWith('\\'))
          {
            tempArr[index][length - 1] = tempArr[index][length - 1].slice(0, -1);
            tempArr[index][length - 1] += v;
          } else
          {
            tempArr[index][length - 1] += v;
          }
        } else
        {
          // console.log('3');
          index++;
        }
        // console.log(tempArr);
      } else
      {

        if (!tempArr[index]) { tempArr[index] = ['']; }
        const length = tempArr[index].length;
        if (Array.isArray(tempArr[index][length - 1]))
        {
          tempArr[index].push(v);
        } else
        {
          // console.log(tempArr)
          tempArr[index][length - 1] += v;
        }
      }
    }
    return tempArr[0];
  };

  const aTemp = par();

  const a = aTemp.length > 0 ? aTemp : aTemp[0];

  const par2 = (arr: any[]): any[] =>
  {
    const c = [];
    for (let d of arr)
    {
      if (Array.isArray(d))
      {
        if (d.length == 1 && !Array.isArray(d[0]))
        {
          c.push(d[0]);
        } else
        {
          c.push(par2(d));
        }
      } else
      {
        c.push(d);
      }
    }

    return c;
  };

  const b = par2(a);
  // console.log(a);
  // console.log(b);
  return b;
};

export interface chatFunctionType
{
  args: any[],
  matchs: matchType;
  wordData: wordSaveData;
  parPack: typeParPack;
  internal: {
    saveItem: (uid: string, saveDB: string, itemName: string, number: number) => Promise<boolean>;
    getItem: (uid: string, saveDB: string, itemName: string) => Promise<any>;
    getUserConfig: (uid: string, key: string) => Promise<settingTypeValue>;
    saveUserConfig: (uid: string, key: string, value: settingTypeValue) => Promise<void>;
    removeUserConfig: (uid: string, key: string) => Promise<void>;
  };
}

const parseTrees = async (questionList: string, word: word, inData: any[], session: Session | wordDataInputType, wordData: wordSaveData, matchList: matchType, inputUserData: any): Promise<{ data: parTemp, message: string | any[]; } | null> =>
{
  // 遍历最深层字符串，解析后返回结果，重复运行

  const par = async (functonArray: any[], data: parTemp): Promise<{ data: any, message: string | any[]; } | null> =>
  {
    let userDataTemp = data;
    let isIF = ifFuncPackKeys.includes(functonArray[0]);
    const rule: number[] = (isIF) ? ifStatement[functonArray[0]].rule as number[] : [0];

    // 查看当前输入数组的各项是否都为字符串，若发现包含非字符串的项，则递归调用自身解析
    for (let i = 0; i < functonArray.length; i++)
    {
      const canPar = (isIF) ? Array.isArray(functonArray[i]) && rule[i] == 1 : Array.isArray(functonArray[i]);
      // console.log(canPar)
      // console.log(functonArray)
      // 如果有项是数组
      if (canPar)
      {
        const a = await par(functonArray[i], JSON.parse(JSON.stringify(userDataTemp)));

        if (a)
        {
          functonArray[i] = a.message;
          userDataTemp = a.data;
        } else
        {
          saveItemDataTemp[(questionList) ? questionList : ''] = { item: {}, userConfig: {} };
          userDataTemp = { item: {}, userConfig: {} };
        }
      }
    }

    const getPar = async () =>
    {
      const which = functonArray[0];
      const arg = functonArray.slice(1);
      const matchs = matchList;
      const canPar = (funcPackKeys.includes(which) && isIF == false) || (ifFuncPackKeys.includes(which) && isIF == true);

      if (canPar)
      {
        // console.log(which);
        // console.log(userDataTemp.item)
        const overPar = await parStatement(which, {
          args: arg,
          matchs: matchs,
          wordData: wordData,
          parPack: parPack,
          internal: { // 缓存功能
            saveItem: async (uid: string, saveDB: string, itemName: string, number: number) =>
            {
              if (!userDataTemp.item) { userDataTemp.item = {}; }

              if (!userDataTemp.item[uid]) { userDataTemp.item[uid] = {}; }

              if (!userDataTemp.item[uid][saveDB]) { userDataTemp.item[uid][saveDB] = {}; }

              userDataTemp.item[uid][saveDB][itemName] = number;
              saveItemDataTemp[(questionList) ? questionList : ''] = userDataTemp;

              // return await word.user.updateItem(uid, saveDB, itemName, number);
              return true;
            },

            getItem: async (uid: string, saveDB: string, itemName: string) =>
            {
              const num = await word.user.getItem(uid, saveDB, itemName);

              if (!userDataTemp.item) { userDataTemp.item = {}; }

              if (!userDataTemp.item[uid]) { userDataTemp.item[uid] = {}; }

              if (!userDataTemp.item[uid][saveDB]) { userDataTemp.item[uid][saveDB] = {}; }

              if (!userDataTemp.item[uid][saveDB][itemName] && userDataTemp.item[uid][saveDB][itemName] != 0) { userDataTemp.item[uid][saveDB][itemName] = num ? num : 0; }

              saveItemDataTemp[(questionList) ? questionList : ''] = userDataTemp;

              return userDataTemp.item[uid][saveDB][itemName];
              // return num;
            },

            getUserConfig: async (uid: string, key: string) =>
            {
              const userConfig = await word.user.getConfig(uid);

              if (!userDataTemp.userConfig) { userDataTemp.userConfig = {}; }

              if (!userDataTemp.userConfig[uid]) { userDataTemp.userConfig[uid] = {}; }

              userDataTemp.userConfig[uid] = userConfig;
              saveItemDataTemp[(questionList) ? questionList : ''] = userDataTemp;

              return userDataTemp.userConfig[uid][key];
            },

            saveUserConfig: async (uid: string, key: string, value: settingTypeValue) =>
            {
              if (!userDataTemp.userConfig) { userDataTemp.userConfig = {}; }

              if (!userDataTemp.userConfig[uid]) { userDataTemp.userConfig[uid] = await word.user.getConfig(uid); }

              userDataTemp.userConfig[uid][key] = value;

              saveItemDataTemp[(questionList) ? questionList : ''] = userDataTemp;
            },

            removeUserConfig: async (uid: string, key: string) =>
            {
              if (!userDataTemp.userConfig[uid]) { userDataTemp.userConfig[uid] = await word.user.getConfig(uid); }
              if (!userDataTemp.userConfig[uid][key]) { return; }

              delete userDataTemp.userConfig[uid][key];

              saveItemDataTemp[(questionList) ? questionList : ''] = userDataTemp;
            }
          }
        }, session, isIF);

        if (Array.isArray(overPar))
        {
          const a = await par(overPar, JSON.parse(JSON.stringify(userDataTemp)));
          // console.log(a);
          if (a)
          {
            return { message: a.message, data: a.data };
          } else
          {
            saveItemDataTemp[(questionList) ? questionList : ''] = { item: {}, userConfig: {} };
            userDataTemp = { item: {}, userConfig: {} };
            return { message: '', data: userDataTemp };
          }
        }
        else if (overPar || overPar == '')
        {
          return { message: overPar, data: userDataTemp };
        }
        else
        {
          return null;
        }

      } else
      {
        return { message: functonArray.join(''), data: userDataTemp };
      }
    };
    // console.log(functonArray)
    const outData = getPar();
    // console.log(outData)
    return outData;
  };

  const aaa = await par(inData, JSON.parse(JSON.stringify(inputUserData)));

  return aaa;
};

// 调用词库语法
const parStatement = async (which: string, toInData: chatFunctionType, session: Session | wordDataInputType, isIF: boolean) =>
{
  let str: string | void | statusMsg;
  if (isIF)
  {
    str = await ifStatement[which].func(toInData, session);
  } else
  {
    str = await statement[which].func(toInData, session);
  }

  if (Array.isArray(str))
  {
    return str;
  } else if (typeof str == "object")
  {
    const status = str.status;
    if (status == 'end' || status == 'next' || status == 'kill')
    {
      const errorMsg = `${status}${(str.data) ? ':' + str.data : ''}`;
      throw new Error(errorMsg);
    }
    if (status == 'killthis')
    {
      return null;
    }
  } else
  {
    return (str) ? str : '';
  }
  return '';
};