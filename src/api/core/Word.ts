import { Context } from "koishi"
import { logger } from "../.."

export interface wordSaveData {
  author: string
  saveDB: string
  data: Record<string, string[]>
}

export interface wordCache {
  allWord: Record<string, string[]>
  allKey: string[]
}

export default class Editor {
  /**
   * @param {string} name 当前词库名称  
   */
  name: string

  ctx: Context

  /**
   * @param {string} uid 触发者标识
   */
  uid: string

  cache: wordCache
  /**
   * 词库editor实例化
   * @param {Context} ctx 触发时，所在的上下文
   * @param {string} name 词库名称
   * @param {string} uid 唯一标识
   */

  /**
   * 词库editor实例化
   * @param {Context} ctx 触发时，所在的上下文
   * @param {string} name 词库名称
   * @param {string} uid 唯一标识
   */
  constructor(ctx: Context, name: string, uid: string) {
    this.ctx = ctx
    this.name = name
    this.uid = uid
    this.cache = {
      allWord: {},
      allKey: []
    }
    this.getCache()
  }

  // 读取词库
  async getWordObj() {
    const obj = await this.ctx.database.get('wordData', this.name)
    if (obj.length <= 0) {
      // const templateObj = {
      //   id: this.name,
      //   data: {
      //     author: this.uid,
      //     saveDB: 'default',
      //     data: {}
      //   }
      // }
      // await this.ctx.database.create('wordData', templateObj)
      // return templateObj
      return null
    }

    return obj[0].data
  }

  // 新建库
  async craeteWord() {
    const obj = await this.ctx.database.get('wordData', this.name)
    if (obj.length <= 0) {
      const templateObj = {
        id: this.name,
        data: {
          author: this.uid,
          saveDB: 'default',
          data: {}
        }
      }
      await this.ctx.database.create('wordData', templateObj)
      return {
        author: this.uid,
        saveDB: 'default',
        data: {}
      }
    }

    return '[core] 库已存在'
  }

  // 查询作者
  async getAuthor() {
    const obj = await this.ctx.database.get('wordData', this.name)
    if (obj.length <= 0) {
      return null
    }

    return obj[0].data.author
  }

  // 写入词库
  async updateWord(newData: wordSaveData) {
    const author = await this.getAuthor()
    if (author !== this.uid) { return '[core] 你不是作者' }

    const obj = await this.ctx.database.get('wordData', this.name)

    if (obj.length <= 0) {
      const templateObj = {
        id: this.name,
        data: newData
      }
      await this.ctx.database.create('wordData', templateObj)
      return true
    }

    await this.ctx.database.set('wordData', this.name, {
      data: newData
    })
    return true
  }

  // 设置格子
  async setSaveDB(dbName: string) {
    const wordObj = await this.getWordObj()
    if (!wordObj) { return '[core] 该词库不存在' }

    const author = await this.getAuthor()
    if (author !== this.uid) { return '[core] 你不是此词库作者' }

    wordObj.saveDB = dbName
    this.updateWord(wordObj)

    return true
  }

  // 删除词库
  async removeWord() {
    const wordObj = await this.getWordObj()
    if (!wordObj) { return '[core] 该词库不存在' }

    const author = await this.getAuthor()
    if (author !== this.uid) { return '[core] 你不是此词库作者' }

    await this.ctx.database.create('recycleBinList', {
      id: this.name,
      data: wordObj
    })

    await this.ctx.database.remove('wordData', this.name)

    return true
  }

  // 添加词条
  async addQuestion(q: string, a: string) {
    const wordObj = await this.getWordObj()
    if (!wordObj) { return '[core] 该词库不存在' }

    const author = await this.getAuthor()
    if (author !== this.uid) { return '[core] 你不是此词库作者' }

    if (!wordObj.data.hasOwnProperty(q)) {
      wordObj.data[q] = [a]
      await this.updateWord(wordObj)
      return 1;
    } else {
      wordObj.data[q].push(a)
      await this.updateWord(wordObj)
      return wordObj.data[q].length
    }
  }

  // 删除词条（序号及all）
  async rmQuestion(q: string, index: 'all' | number) {
    const wordObj = await this.getWordObj()
    if (!wordObj) { return '[core] 该词库不存在' }

    const author = await this.getAuthor()
    if (author !== this.uid) { return '[core] 你不是此词库作者' }

    if (!wordObj.data.hasOwnProperty(q)) { return '[core] 当前词库中不存在此问' }

    if (index === 'all') {
      delete wordObj.data[q]
      this.updateWord(wordObj)
      return true
    } else {
      wordObj.data[q].splice(index - 1, 1)
      this.updateWord(wordObj)
      return true
    }
  }

  // 恢复删除
  async recoveryWord() {
    const recoveryObj = await this.ctx.database.get('recycleBinList', this.name)
    if (recoveryObj.length <= 0) { return '[core] 回收站无此词库' }

    const mainRecoveryObj = recoveryObj[0]

    await this.ctx.database.remove('recycleBinList', this.name)

    await this.ctx.database.create('wordData', mainRecoveryObj)

    return true
  }

  // 清空回收站
  async clearRecoveryList() {
    const list = await this.ctx.database.get('recycleBinList', { id: { $regex: /[\s\S]+/ } }, ['id'])

    if (list.length <= 0) { return '[core] 回收站已空' }

    for (let i = 0; i < list.length; i++) {
      await this.ctx.database.remove('recycleBinList', list[i])
    }
    return true
  }

  // 根据正则查询当前词库是否含有某关键词
  async findKey(reg?: RegExp) {
    const wordObj = await this.getWordObj()
    if (!wordObj) { return '[core] 该词库不存在' }
    const keys = Object.keys(wordObj)

    if (reg) {
      let outTemp: string[] = []
      keys.forEach((v: string) => {
        if (reg.test(v)) { outTemp.push(v) }
      })

      return outTemp
    } else {
      return keys
    }
  }

  // 获取当前词库列表
  async getWordList() {
    const list = await this.ctx.database.get('wordData', { id: { $regex: /[\s\S]+/ } }, ['id'])
    return list
  }

  // 获取词库缓存
  async getCache() {
    const cache = new Load(this.ctx)
    this.cache = await cache.getCache()
  }

  // 远程上传词库
  async upload() {

  }

  // 远程下载词库
  async downLoad() {

  }
}


export class Load {
  ctx: Context
  constructor(ctx: Context) {
    this.ctx = ctx
  }

  async getCache() {
    const wordObjTemp = await this.ctx.database.get('wordData', { id: { $regex: /[\s\S]+/ } })
    const wordObj = wordObjTemp.map(v => {
      if (!v.data.hasOwnProperty('data')) {
        logger.warn(`[core] [${v.id}]: 词库列表损坏`)
        return {}
      } else {
        return v.data.data
      }
    })

    let outData: Record<string, string[]> = {}
    for (let i = 0; i < wordObj.length; i++) {
      const list = Object.keys(wordObj[i])
      for (let i2 = 0; i2 < list.length; i2++) {
        const nowKey = list[i2]
        if (outData.hasOwnProperty(nowKey)) {

          outData[nowKey].concat(wordObj[i][nowKey])
        } else {
          outData[nowKey] = wordObj[i][nowKey]
        }
      }
    }

    const cache: wordCache = {
      allWord: outData,
      allKey: Object.keys(outData)
    }
    return cache
  }
}