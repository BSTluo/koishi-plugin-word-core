import { randomNumber } from "../../Service";

export const parsStart = (questionList: string[]) => {

  const getRandQuestion = (questionList: string[]) => {
    const num = randomNumber(0, questionList.length - 1);

    return questionList[num];
  };

  let temp = getRandQuestion(questionList);
  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
  const tree = getTree(temp);

  // 再进行树的解析
  const msg = paresTress(tree);
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

const paresTress = (inData: any[]) => {
  // 遍历数组，如果是数组，则递归自己，如果不是，则以:分割，分割后进行解析，完成后将自身所在数组合并为一个字符串，并且return回去
};