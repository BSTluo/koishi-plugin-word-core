import { getDBTools, readDBTools } from "../.."

export const wordCache: Cache = {
  hasKey: {}
}

export interface Cache {
  hasKey: Record<string, string[]>
}

const getCache = async () => {
  const { idList, dataList } = await getDBTools('wordData')
  dataList.forEach((item, index) => {
    Object.keys(item).forEach(v => {
      if (!wordCache.hasKey[v]) { wordCache.hasKey[v] = [] }
      // wordCache.hasKey[v].push(idList[index])
    })
  })
}