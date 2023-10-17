import { readDBTools, writeDBTools } from "../.."

// 编辑用户数据
export class User {
  uid: string

  constructor(uid: string) {
    this.uid = uid
  }

  async getData() {
    const data = await readDBTools('wordUserData', this.uid)
    return data
  }

  async updateData(data: Record<string, string>) {
    const backData = await writeDBTools('wordData', this.uid, data)
    return backData
  }

  async getItem(cell: string, itemName: string) {
    const data = await this.getData()
    if (!data[cell]) { return null }
    if (!data[cell][itemName]) { return null }
    return data[cell][itemName]
  }

  async updateItem(cell: string, itemName: string, amount: number) {
    const data = await this.getData()
    if (!data[cell]) { data[cell] = {} }
    if (!data[cell][itemName]) { data[cell][itemName] = amount }
    return await this.updateData(data)
  }
}