// 发送视频

import { wordGenerator, Order } from '../generators/word';

export const video = {
  'type': 'video',
  'message0': '发送视频\n视频直链：%1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'url'
    }
  ],
  'colour': 121,
  'tooltip': '发送视频',
  'output': 'String'
};

wordGenerator.forBlock['video'] = function (block, generator)
{
  const url = block.getFieldValue('url') || '';

  return [`(视频:${String(url)})`, Order.NONE];
};

export const videoTools = {
  kind: 'block',
  type: 'video',
  inputs: {
    url: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '直链'
        }
      }
    },
  }
};
