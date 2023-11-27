import { Context } from "koishi";
import { chatFunctionType } from '../Driver/src';

export const statement: statementType = {
  '+': (inData: chatFunctionType, ctx: Context): string => {
    return inData.args[1];
  }
};

export type statementType = {
  [key: string]: (inData: chatFunctionType, ctx: Context) => string;
};