import { Context, Logger, Schema } from 'koishi';
import * as core from './src/index';
import { word } from './src/word';

export const name = 'word-core';

export * from './src/word';

export interface Config { }

export const Config: Schema<Config> = Schema.object({});

export const logger = new Logger('Word-core');

// TypeScript 用户需要进行类型合并

export const apply = async (ctx: Context) => {
  ctx.plugin(core);
  ctx.plugin(word);
  ctx.inject(['word'], async ctx=>{
    // ctx.word.editor.addWordItem('test', '5b0fe8a3b1ff2', '你好', '你也好')
    ctx.word.wordDriver.start('你好')
  })
};