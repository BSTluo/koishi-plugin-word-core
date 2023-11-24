import { randomNumber } from "../../Service";

export const parsStart = (questionList: string[]) => {
  const getRandQuestion = (questionList: string[]) => {
    return questionList[randomNumber(0, randomNumber.length - 1)];
  };

  let temp = getRandQuestion(questionList);

  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
  const msg = parse(temp);

  // 再进行树的解析
  console.log(msg)
};

const parse = (str: string): any[] => {
  const tempArr: any[] = [];
  let index = 0;

  for (let i = 0; i < str.length; i++) {
    const v = str[i];

    if (v === '(') {
      index++;
      const strTemp = str.substring(i);
      tempArr[index] = parse(strTemp);
    } else if (v === ')') {
      index++;
      return tempArr;
    } else {
      if (!tempArr[index]) { tempArr[index] = ''; }
      tempArr[index] += v;
    }
  }

  return tempArr;
};

