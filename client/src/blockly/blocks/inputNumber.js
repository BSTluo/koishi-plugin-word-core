// 创建数字匹配(数)

import { wordGenerator, Order } from '../generators/word';

export const inputNumber = {
    'type': 'inputNumber',
    'message0': '一个数字',
    'colour': 85,
    'tooltip': '匹配一个数字',
    'output': 'String'
};

wordGenerator.forBlock['inputNumber'] = function (block, generator)
{
    return [`(数)`, Order.NONE];
};

export const inputNumberTools = {
    kind: 'block',
    type: 'inputNumber'
};
