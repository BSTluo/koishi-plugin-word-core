// 创建数字匹配(数)

import { wordGenerator, Order } from '../generators/word';

export const inputAt = {
    'type': 'inputAt',
    'message0': '一个at',
    'colour': 85,
    'tooltip': '匹配一个at',
    'output': 'String'
};

wordGenerator.forBlock['inputAt'] = function (block, generator)
{
    return [`(@)`, Order.NONE];
};

export const inputAtTools = {
    kind: 'block',
    type: 'inputAt'
};
