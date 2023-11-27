// 输入替换
// 将某些输入替换为xx符号
export const trigger: triggerType = {
  '(@)': { reg: '\s*[\*([\s\S]+?)\*]\s*', id: 'at' },
  '(id)': { reg: '\s*[@([\s\S]+?)@]\s*', id: 'id' }
};

export type triggerType = {
  [key: string]: { reg: string, id: string; };
};