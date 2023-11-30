import { Context } from "koishi";
import { chatFunctionType } from '../Driver/src';

export const statement: statementType = {
  '+': async (inData: chatFunctionType, ctx: Context): Promise<string | void> => {
    return inData.args[1];
  }
};

/**
 * 新增规则
 * @param ruleTrigger 词库语句关键词
 * @param callback 触发时执行的函数，返回值为字符串，此字符串会替换词库语句
 * @returns 当前整个statment规则
 */
export const addStatement = (ruleTrigger: string, callback: (inData: chatFunctionType, ctx: Context) => Promise<string | void>) => {
  statement[ruleTrigger] = callback;
  return statement;
};

/**
 * 删除规则
 * @param ruleTrigger 词库语句关键词
 * @returns 当前整个statment规则
 */
export const rmStatement = (ruleTrigger: string) => {
  delete statement[ruleTrigger];
  return statement;
};

export type statementType = {
  [key: string]: (inData: chatFunctionType, ctx: Context) => Promise<string | void>;
};

export interface statementFunction {
  statement: statementType;
  addStatement: (ruleTrigger: string, callback: (inData: chatFunctionType, ctx: Context) => Promise<string | void>) => statementType;
  rmStatement: (ruleTrigger: string) => statementType;
}