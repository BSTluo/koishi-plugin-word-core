import { Context } from "koishi";
import { word } from './Service/index';

export const using = ['database'];

declare module 'koishi' {
  interface Tables extends DBTypeList {}
}

export type DBTypeList = {
  wordUserData: wordUserData;
  wordData: wordData;
  recycleBinList: recycleBinList;
  wordUserConfig: wordUserConfig;
};

export interface wordSaveData {
  saveDB: string;
  author: string[];
  data: Record<string, string[]>;
}

export interface wordUserConfig {
  id: string;
  data: Record<string, string>;
}

export interface wordUserData {
  id: string;
  data: Record<string, string>;
}

export interface wordData {
  id: string;
  data: wordSaveData;
}

export interface recycleBinList {
  id: string;
  data: wordSaveData;
}

const dbInit = (ctx: Context) => {

  ctx.model.extend('wordUserData', {
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
};

export const apply = async (ctx: Context) => {
  dbInit(ctx);
  ctx.plugin(word);
};