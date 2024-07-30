// 排行榜

import { wordGenerator, Order } from '../generators/word';

export const leaderboard = {
  'type': 'leaderboard',
  'message0': '获取物品：%1 的排行榜',
  'args0': [
    {
      'type': 'input_value',
      'name': 'itemName'
    }
  ],
  'colour': 85,
  'tooltip': '获取排行榜',
  'output': 'String'
};

wordGenerator.forBlock['leaderboard'] = function (block, generator)
{
  const itemName = block.getFieldValue('itemName') || '';

  return [`(排行榜:${String(itemName)})`, Order.NONE];
};

export const leaderboardTools = {
  kind: 'block',
  type: 'leaderboard',
  inputs: {
    itemName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '物品名称'
        }
      }
    },
  }
};
