import { wordGenerator, Order } from '../generators/word';

export const getItemAmount1 = {
  'type': 'getItemAmount1',
  'message0': '获取背包内 %1 的数量',
  'args0': [
    {
      'type': 'input_value',
      'name': 'itemName'
    }
  ],
  'colour': 85,
  'tooltip': '获取触发者背包内某物品的数量',
  'output': 'String'
};

export const getItemAmount2 = {
  'type': 'getItemAmount2',
  'message0': '获取 %2 的背包内名字为 %1 的物品的数量',
  'args0': [
    {
      'type': 'input_value',
      'name': 'itemName'
    },
    {
      'type': 'input_value',
      'name': 'who'
    }
  ],
  'colour': 85,
  'tooltip': '获取某人的背包内某物品的数量',
  'output': 'String'
};

wordGenerator.forBlock['getItemAmount1'] = function (block, generator)
{
  const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
  return [`(#:${itemName})`, Order.NONE];
};

wordGenerator.forBlock['getItemAmount2'] = function (block, generator)
{
  const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || 0;
  const uid = generator.valueToCode(block, 'who', Order.NONE) || '';

  return [`(#:${itemName}:${uid})`, Order.NONE];
};

export const getItemAmount1Tools = {
  kind: 'block',
  type: 'getItemAmount1',
  inputs: {
    itemName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '物品名称'
        }
      }
    }
  },
};

export const getItemAmount2Tools = {
  kind: 'block',
  type: 'getItemAmount2',
  inputs: {
    itemName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '物品名称'
        }
      }
    },
    who: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '用户id'
        }
      }
    }
  },
};