import { Context } from "koishi";
import { statement } from "../../extend/statement";

let funcPackKeys = Object.keys(statement);

export const parsStart = (questionList: string[], ctx: Context) => {
  const randomNumber = ctx.word.tools.randomNumber;

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
  console.log(tree);
  // 再进行树的解析
  const msg = parseTrees(tree, ctx);
  console.log(msg);
};

const getTree = (str: string): any[] => {
  let parseStr = str;

  const par = () => {
    const tempArr: any[] = [];
    let index = 0;

    while (parseStr.length > 0) {
      const v = parseStr[0];
      parseStr = parseStr.slice(1);

      if (v === '(') {
        index++;
        // parseStr = parseStr.slice(0);
        tempArr[index] = par();
        index++;
      } else if (v === ')') {
        return tempArr;
        // } else if (v === ':') {
        //   index++;
        // } else {
      } else {
        if (!tempArr[index]) { tempArr[index] = ''; }
        tempArr[index] += v;
      }
    }

    return tempArr;
  };

  const a = par();
  return a;
};

const parseTrees = (inData: any[], ctx: Context): string => {
  // 遍历最深层字符串，解析后返回结果，重复运行
  for (let i = 0; i < inData.length; i++) {
    if (Array.isArray(inData[i])) {
      inData[i] = parseTrees(inData[i], ctx); // 递归调用处理嵌套数组
    }
  }
  const reload = inData.join('');
  const newFunArr = reload.split(':');

  // newFunArr 是解析得到的语法字符串
  if (funcPackKeys.includes(newFunArr[0])) {
    const which = newFunArr[0];
    const inData = {
      args: newFunArr.slice(1)
    }
    const str: string = statement[which](newFunArr, ctx);

    return str;
  } else {
    return newFunArr.join('');
  }
};
