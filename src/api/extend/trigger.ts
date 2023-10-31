// 输入替换
// 将某些输入替换为xx符号
export const trigger:triggerType = {
  '(@)': ['\s*[\*([\s\S]+)\*]\s*'],
  '(id)': ['\s*[@([\s\S]+)@]\s*']
};

export type triggerType = Record<string, string[]>