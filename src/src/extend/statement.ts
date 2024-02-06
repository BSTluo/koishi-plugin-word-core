import { Context, Session } from "koishi";
import { chatFunctionType } from '../driver/src';

export const statement: statementType = {
};

/**
 * 新增规则
 * @param ruleTrigger 词库语句关键词
 * @param callback 触发时执行的函数，返回值为字符串，此字符串会替换词库语句
 * @returns 当前整个statment规则
 */
export const addStatement = (ruleTrigger: string, callback: (inData: chatFunctionType, session: Session) => statementCallBackType) => {
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

export type statementCallBackType = Promise<string | void | statusMsg>

export type statementType = {
  [key: string]: (inData: chatFunctionType, session: Session) => statementCallBackType;
};

export type statusMsg = { status: string; data?: string; };

export interface statementFunction {
  statement: statementType;
  addStatement: (ruleTrigger: string, callback: (inData: chatFunctionType, session: Session) => statementCallBackType) => statementType;
  rmStatement: (ruleTrigger: string) => statementType;
}