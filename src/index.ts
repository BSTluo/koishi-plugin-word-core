import { Context, DatabaseService, Logger, Schema } from 'koishi'
import { getDB, readDB, writeDB } from './api/Tools/Tools'

export const name = 'word-core'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export const using = ['database']

export const logger = new Logger('Word-core')

// TypeScript 用户需要进行类型合并
declare module 'koishi' {
  interface Tables {
    wordUserData: wordUserData
    wordData: wordData
    recycleBinList: recycleBinList
    wordUserConfig: wordUserConfig
  }
}

export interface wordSaveData {
  saveDB: string
  author: string[]
  data: Record<string, string[]>
}

export interface wordUserConfig {
  id: string
  data: Record<string, string>
}

export interface wordUserData {
  id: string
  data: Record<string, string>
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

  ctx.model.extend('wordUserData', {
    id: 'string',
    data: 'json'
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

export let database: DatabaseService

class KoishiWordDriver {
  ctx: Context = new Context()

  readDB(dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string) {
    return readDB(this.ctx, dbName, key)
  }

  writeDB(dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig', key: string, data: any) {
    return writeDB(this.ctx, dbName, key, data)
  }

  getDB(dbName: 'wordUserData' | 'wordData' | 'recycleBinList' | 'wordUserConfig') {
    return getDB(this.ctx, dbName)
  }

  apply(ctx: Context) {
    this.ctx = ctx
  }
}

const KoishiWord = new KoishiWordDriver()

export const apply = KoishiWord.apply

export const readDBTools = KoishiWord.readDB

export const writeDBTools = KoishiWord.writeDB

export const getDBTools = KoishiWord.getDB