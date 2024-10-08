// 发送歌曲

import { wordGenerator, Order } from '../generators/word';

export const music = {
  'type': 'music',
  'message0': '发送歌曲\n歌曲直链：%1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'url'
    }
  ],
  'colour': 102,
  'tooltip': '发送歌曲',
  'output': 'String'
};

wordGenerator.forBlock['music'] = function (block, generator)
{
  const url = block.getFieldValue('url') || '';

  return [`(歌曲:${String(url)})`, Order.NONE];
};

export const musicTools = {
  kind: 'block',
  type: 'music',
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
