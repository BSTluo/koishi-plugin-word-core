import { Context } from "koishi"

export type userData = Record<string, Record<string, number>> 

export default class User {
  id: string
  ctx: Context

  constructor(ctx: Context, id: string) {
    this.ctx = ctx
    this.id = id
  }

  async getUserData():Promise<userData> {
    const userDataOrigin = await this.ctx.database.get('wordUserData', this.id)
    let userData = {}

    if (userDataOrigin.length <= 0) {
      userData = {}
      await this.ctx.database.create('wordUserData', {
        id: this.id,
        item: userData
      })
    }

    userData = userDataOrigin[0].item
    return userData
  }

  async updateUserData(userData: userData) {
    const userDataOrigin = await this.ctx.database.get('wordUserData', this.id)

    if (userDataOrigin.length <= 0) {
      userData = {}
      await this.ctx.database.create('wordUserData', {
        id: this.id,
        item: userData
      })
    } else {
      await this.ctx.database.set('wordUserData', this.id, userData)
    }
  }

  async getItem(cell: string, itemName: string) {
    const userData = await this.getUserData()
    if (!userData.hasOwnProperty(cell)) { userData[cell] = {}; userData[cell][itemName] = 0; }

    return userData[cell][itemName]
  }

  async setItem(cell: string, itemName: string, itemData: number) {
    const userData = await this.getUserData()
    
    if (!userData.hasOwnProperty(cell)) {
      let data = userData
      data[cell] = {}
      data[cell][itemName] = itemData

      await this.ctx.database.set('wordUserData', this.id, {
        item: data
      })
    } else {
      userData[cell][itemName] = itemData
      await this.ctx.database.set('wordUserData', this.id, {
        item: userData
      })
    }

    return true
  }

  async getUserList() {
    const idList = await this.ctx.database.get('wordUserData', { id: { $regex: /[\s\S]+/ } }, ['id'])
    const id = idList.map(v => {
      return v.id
    })
    return id
  }

  async getConfig(item: string) {
    const userDataOrigin = await this.ctx.database.get('wordUserConfig', this.id)
    let configData:Record<string, string> = {}

    if (userDataOrigin.length <= 0) {
      configData = {}
      await this.ctx.database.create('wordUserConfig', {
        id: this.id,
        configItem: configData
      })
    }

    configData = userDataOrigin[0].configItem
    if (configData.hasOwnProperty(item)) {
      return configData[item]
    } else {
      return null
    }
  }

  async setConfig(item: string, data: string) {
    const userDataOrigin = await this.ctx.database.get('wordUserConfig', this.id)
    const userConfigObj = userDataOrigin[0].configItem

    if (Object.keys(userConfigObj).length <= 0) {
      let tempData:Record<string, string> = {}

      tempData[item] = data

      await this.ctx.database.create('wordUserData', {
        id: this.id,
        item: tempData
      })

      return true
    }

    if (!userConfigObj.hasOwnProperty(item)) {
      let tempData = userConfigObj

      tempData[item] = data

      await this.ctx.database.set('wordUserData', this.id, {
        id: this.id,
        item: tempData
      })
      return true
    }
  }
}