// 禁言

import { wordGenerator, Order } from '../generators/word';

export const prohibit1 = {
  'type': 'prohibit1',
  'tooltip': '禁言一个人',
  'colour': 85,
  'output': 'String',
  'message0': '禁言\n 时长(秒)：%1 \n用户id：%2 \n理由：%3',
  'args0': [
    {
      'type': 'input_value',
      'name': 'long'
    },
    {
      'type': 'input_value',
      'name': 'uid'
    },
    {
      'type': 'input_value',
      'name': 'reason'
    }
  ]
};

export const prohibit2 = {
  'type': 'prohibit2',
  'tooltip': '禁言一个人',
  'colour': 85,
  'output': 'String',
  'message0': '禁言触发者\n 时长(秒)：%1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'long'
    }
  ]
};

wordGenerator.forBlock['prohibit1'] = function (block, generator)
{
  const long = generator.valueToCode(block, 'long', Order.NONE) || '';
  const uid = generator.valueToCode(block, 'uid', Order.NONE) || '';
  const reason = generator.valueToCode(block, 'reason', Order.NONE) || '';
  
  return [`(禁言:${long}:${uid}:${reason})`, Order.NONE];
};

wordGenerator.forBlock['prohibit2'] = function (block, generator)
{
  const long = generator.valueToCode(block, 'long', Order.NONE) || '';
  
  return [`(禁言:${long})`, Order.NONE];
};

export const prohibit1Tools = {
  kind: 'block',
  type: 'prohibit1',
  inputs: {
    long: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '60'
        }
      }
    },
    uid: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '用户id'
        }
      }
    },
    reason: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '原因'
        }
      }
    }
  },
};

export const prohibit2Tools = {
  kind: 'block',
  type: 'prohibit2',
  inputs: {
    long: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '60'
        }
      }
    }
  },
};