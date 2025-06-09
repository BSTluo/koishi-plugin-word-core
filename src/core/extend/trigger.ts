// 输入替换
// 将某些输入替换为xx符号
// 获取trigger
export const trigger: triggerType = {
  '(@)': { reg: ['\\s*<at\\s+id=\\"(?:\\d+)\\"\\s+name=\\"@([^\\"]*)\\"\\s*/?>\\s*', '\\s\*<at name=\\"([\\s\\S]+?)\\"\\/>\\s\*'], id: 'name' },
  '(#)': { reg: ['\\s*<at\\s+id=\\\"(\\d+)\\\"\\s+(?:name=\\\"[^\\\"]*\\\")\\s*/?>\\s*', '\\s\*<at id=\\"([\\s\\S]+?)\\"\\/>\\s\*'], id: 'id' }
};

/**
 * 新增trigger
 * @param triggerName 此触发器的id
 * @param replaceStr 在问中以此字符取代正则所匹配的内容
 * @param matchReg 此内容的正则
 * @returns 
 */
export const addTrigger = (triggerName: string, replaceStr: string, matchReg: string) =>
{
  if (!trigger[replaceStr])
  {
    trigger[replaceStr] = {
      reg: [],
      id: triggerName
    };
  }
  trigger[replaceStr].reg.push(matchReg);

  return trigger;
};

/**
 * 删除trigger
 * @param replaceStr 在问中以此字符取代正则所匹配的内容
 * @param matchReg 此内容的正则
 * @returns 
 */
export const rmTrigger = (replaceStr: string, matchReg: string) =>
{
  if (!trigger[replaceStr]) { return trigger; }
  if (!trigger[replaceStr].reg.includes(matchReg)) { return trigger; }

  const index = trigger[replaceStr].reg.indexOf(matchReg);
  trigger[replaceStr].reg = trigger[replaceStr].reg.splice(index, 1);
  return trigger;
};

export type triggerType = {
  [key: string]: { reg: string[], id: string; };
};

export interface triggerFunction
{
  trigger: triggerType;
  addTrigger: (triggerName: string, replaceStr: string, matchReg: string) => triggerType;
  rmTrigger: (replaceStr: string, matchReg: string) => triggerType;
}