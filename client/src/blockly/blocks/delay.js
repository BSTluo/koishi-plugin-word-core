import { wordGenerator, Order } from '../generators/word';

export const delay1 = {
  'type': 'delay1',
  'message0': '延迟 %1 秒 发送后续内容',
  'args0': [
    {
      'type': 'input_value',
      'name': 'time'
    }
  ],
  'colour': 85,
  'tooltip': '延迟发送之后的消息',
  'output': 'String'
};

export const delay2 = {
  'type': 'delay2',
  'message0': '延迟 %1 秒，发送：%2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'time'
    },
    {
      'type': 'input_value',
      'name': 'msg'
    }
  ],
  'colour': 85,
  'tooltip': '延迟发送指定的消息',
  'output': 'String'
};

wordGenerator.forBlock['delay1'] = function (block, generator)
{
  const time = generator.valueToCode(block, 'time', Order.NONE) || 0;

  return [`(&:${time})`, Order.NONE];
};

wordGenerator.forBlock['delay2'] = function (block, generator)
{
  const time = generator.valueToCode(block, 'time', Order.NONE) || 0;
  const msg = generator.valueToCode(block, 'msg', Order.NONE) || '';

  return [`(&:${time}:${msg})`, Order.NONE];
};

export const delay1Tools = {
  kind: 'block',
  type: 'delay1',
  inputs: {
    time: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '1'
        }
      }
    }
  },
};

export const delay2Tools = {
  kind: 'block',
  type: 'delay2',
  inputs: {
    time: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '1'
        }
      }
    },
    msg: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '消息内容'
        }
      }
    }
  },
};