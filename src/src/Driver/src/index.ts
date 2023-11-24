import { randomNumber } from "../../Service";

export const parsStart = (questionList: string[]) => {
  const getRandQuestion = (questionList: string[]) => {
    return questionList[randomNumber(0, randomNumber.length - 1)];
  };

  let temp = getRandQuestion(questionList);

  const msg = par(temp);
};

const par = (str: string) => {
  // 先将文本拆解为树
  // 你(+:xx:xx)好
  // [你,[+,xx,xx],好]
};
