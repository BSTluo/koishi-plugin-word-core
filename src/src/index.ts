import { Context } from "koishi";

export const using = ['database'];

declare module 'koishi' {
  interface Tables extends DBTypeList { }
}

export type allType = wordSaveData | Record<string, string> | Record<string, Record<string, number>> | settingType;
export type settingType = Record<string, settingTypeValue>;
export type settingTypeValue = string | number | string[] | number[] | Record<string, string>;

export type DBTypeList = {
  wordUserPackData: wordUserPackData;
  wordData: wordData;
  recycleBinList: recycleBinList;
  wordUserConfig: wordUserConfig;
  wordUserTemp: wordUserTemp;
};

export interface wordSaveData {
  name: string;
  saveDB: string;
  author: string[];
  data: Record<string, string[]>;
}

export interface wordUserConfig {
  id: string;
  data: Record<string, string[]>;
}

export interface wordUserPackData {
  id: string;
  data: Record<string, Record<string, number>>;
}

export interface wordData {
  id: string;
  data: wordSaveData;
}

export interface recycleBinList {
  id: string;
  data: wordSaveData;
}

export interface wordUserTemp {
  id: string;
  data: settingType;
}

const dbInit = (ctx: Context) => {

  ctx.model.extend('wordUserPackData', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  });

  ctx.model.extend('wordData', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  });

  ctx.model.extend('wordUserConfig', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  });

  ctx.model.extend('recycleBinList', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  });

  ctx.model.extend('wordUserTemp', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  });
};

export const apply = async (ctx: Context) => {
  dbInit(ctx);
};