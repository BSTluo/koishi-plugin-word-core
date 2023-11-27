import { Context } from "koishi";

export const statement: statementType = {
    '+': (inData: string[], ctx: Context): string => {
        return inData[1];
    }
};

export type statementType = {
    [key: string]: (inData: string[], ctx: Context) => string;
};