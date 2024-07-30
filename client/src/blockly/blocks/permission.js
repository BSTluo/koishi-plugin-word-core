// 鉴权

import { wordGenerator, Order } from '../generators/word';

export const permission1 = {
  'type': 'permission1',
  'tooltip': '判断用户是否满足权限',
  'colour': 85,
  'output': 'String',
  'message0': '触发者满足：%2 权限时，继续运行',
  'args0': [
    {
      'type': 'input_value',
      'name': 'permissionName'
    }
  ]
};

export const permission2 = {
  'type': 'permission2',
  'tooltip': '判断用户是否满足权限',
  'colour': 85,
  'output': 'String',
  'message0': '触发者满足：%2 权限时，执行 %3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'permissionName'
    },
    {
      'type': 'input_value',
      'name': 'msg',
      'check': 'String'
    }
  ]
};

wordGenerator.forBlock['permission1'] = function (block, generator)
{
  const permissionName = generator.valueToCode(block, 'permissionName', Order.NONE) || '';
  return [`(p:${permissionName})`, Order.NONE];
};

wordGenerator.forBlock['permission2'] = function (block, generator)
{
  const permissionName = generator.valueToCode(block, 'permissionName', Order.NONE) || '';
  const msg = generator.valueToCode(block, 'msg', Order.NONE) || '';
  return [`(p:${permissionName}:${msg})`, Order.NONE];
};

export const permission1Tools = {
  kind: 'block',
  type: 'permission1',
  inputs: {
    permissionName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": 'word.user.op'
        }
      }
    }
  },
};

export const permission2Tools = {
  kind: 'block',
  type: 'permission2',
  inputs: {
    permissionName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": 'word.user.op'
        }
      }
    },
    msg: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '满足要求'
        }
      }
    }
  },
};