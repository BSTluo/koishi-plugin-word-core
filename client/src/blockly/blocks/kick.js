// 踢人

import { wordGenerator, Order } from '../generators/word';

export const kick1 = {
  'type': 'kick1',
  'tooltip': '踢一个人',
  'colour': 99,
  'output': 'String',
  'message0': '踢出一个人\n 用户id：%1\n是否为永久踢出：%2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'uid'
    },
    {
      'type': 'field_dropdown',
      'name': 'type',
      "options": [
        ["不永久踢出", "0"],
        ["永久踢出","1"]
      ]
    }
  ]
};

export const kick2 = {
  'type': 'kick2',
  'tooltip': '踢一个人',
  'colour': 85,
  'output': 'String',
  'message0': '踢出触发者',
};

wordGenerator.forBlock['kick1'] = function (block, generator)
{
  const uid = generator.valueToCode(block, 'uid', Order.NONE) || '';
  const type = block.getFieldValue('type');
  return [`(踢:${uid}):${type}`, Order.NONE];
};

wordGenerator.forBlock['kick2'] = function (block, generator)
{
  return [`(踢)`, Order.NONE];
};

export const kick1Tools = {
  kind: 'block',
  type: 'kick1',
  inputs: {
    uid: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '用户id'
        }
      }
    }
  },
};

export const kick2Tools = {
  kind: 'block',
  type: 'kick2'
};