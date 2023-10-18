import { Context, Service } from "koishi"
import * as Tools from './Tools/Tools'
import * as User from './User/User'
import * as Cache from "./Editor/Cache"

export * from './Tools/Tools'

declare module 'koishi' {
    interface Context {
        word: word
    }
}

export class word extends Service {
    ctx: Context

    Tools: Tools.ToolsFunction = {
        async readDB(dbName, key) { },
        async writeDB(dbName, key, data) { return true },
        getDB(dbName) { },
    }

    User: User.UserFunction = {
        async getData(uid) { return { a: { a: 1 } } },
        async updateData(uid, data) { return true },
        async getItem(uid, cell, item) { return null },
        async updateItem(uid, cell, itemName, amount) { return true }
    }

    Cache: Cache.CacheFunction = {
        async getCache() { return { hasKey: {} } }
    }

    constructor(ctx: Context) {
        // 这样写你就不需要手动给 ctx 赋值了
        super(ctx, 'nazrin', true)
        this.ctx = ctx

        this.Tools.readDB = (dbName, key) => { return Tools.readDBFunction(this.ctx, dbName, key) }
        this.Tools.writeDB = (dbName, key, data) => { return Tools.writeDBFunction(this.ctx, dbName, key, data) }
        this.Tools.getDB = (dbName) => { return Tools.getDBFunction(ctx, dbName) }

        this.User.getData = (uid) => { return User.getData(this.Tools.readDB, uid) }
        this.User.updateData = (uid, data) => { return User.updateData(this.Tools.writeDB, uid, data) }
        this.User.getItem = (uid, cell, item) => { return User.getItem(this.Tools.readDB, uid, cell, item) }
        this.User.updateItem = (uid, cell, itemName, amount) => { return User.updateItem(this.Tools.readDB, this.Tools.writeDB, uid, cell, itemName, amount) }
    }
}