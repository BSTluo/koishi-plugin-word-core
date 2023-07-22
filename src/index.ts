import { Context, Schema, h } from 'koishi'

export const name = 'word-core'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

// TypeScript 用户需要进行类型合并
declare module 'koishi' {
  interface Tables {
    wordCoreConfig: wordCoreConfig
    wordUserData: wordUserData
    wordData: wordData
    recycleBinList: recycleBinList
  }
}

export interface wordCoreConfig {
  id: string
  timeTemp: JSON
  permission: string[]
}

export interface wordUserData {
  id: string
  item: JSON
}

export interface wordData {
  id: string
  data: JSON
}

export interface recycleBinList {
  id: string
  data: JSON
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

  ctx.model.extend('recycleBinList', {
    id: 'string',
    data: 'json'
  }, {
    primary: 'id'
  })
}

export async function apply(ctx: Context) {
  dbInit(ctx)
}
