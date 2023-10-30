import { Context, Logger, Schema } from 'koishi';
import * as core from './api/index';
import { word } from './api/word';

export const name = 'word-core';

export * from './api/word';

export interface Config { }

export const Config: Schema<Config> = Schema.object({});

export const logger = new Logger('Word-core');

// TypeScript 用户需要进行类型合并

export const apply = async (ctx: Context) => {
  ctx.plugin(core);
  ctx.plugin(word);
};