import { Context, Logger, Schema, h } from 'koishi'
import User from './api/lib/data/User'
import { Load, wordSaveData } from './api/lib/data/Word'

export const name = 'word-core'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export const using = ['database']

export const logger = new Logger('Word-core')
// TypeScript 用户需要进行类型合并
declare module 'koishi' {
  interface Tables {
    wordCoreConfig: wordCoreConfig
    wordUserData: wordUserData
    wordData: wordData
    recycleBinList: recycleBinList
    wordUserConfig: wordUserConfig
  }
}

export interface wordCoreConfig {
  id: string
  timeTemp: object
  permission: string[]
}

export interface wordUserConfig {
  id: string
  configItem: Record<string, string>
}

export interface wordUserData {
  id: string
  item: object
}

export interface wordData {
  id: string
  data: wordSaveData
}

export interface recycleBinList {
  id: string
  data: wordSaveData
}

const dbInit = (ctx: Context) => {
  ctx.model.extend('wordCoreConfig', {
    id: 'string',
    timeTemp: 'json',
    permission: 'list'
  }, {
    primary: 'id'
  })

  ctx.model.extend('wordUserData', {
    id: 'string',
    item: 'json'
  }, {
    primary: 'id'
  })

  ctx.model.extend('wordData', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  })

  ctx.model.extend('wordUserConfig', {
    id: 'string',
    configItem: 'json'
  }, {
    primary: 'id'
  })

  ctx.model.extend('recycleBinList', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  })
}

export async function apply(ctx: Context) {
  dbInit(ctx)
  const test = new Load(ctx)
}
