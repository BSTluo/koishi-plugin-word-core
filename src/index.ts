import { Context, Logger, Schema } from 'koishi';
import * as core from './api/index';

export const name = 'word-core';

export interface Config { }

export const Config: Schema<Config> = Schema.object({});

export const logger = new Logger('Word-core');

// TypeScript 用户需要进行类型合并

export const apply = (ctx: Context) => {
  ctx.plugin(core);
};