// 获取第几个输入的数字

import { wordGenerator, Order } from '../generators/word';

export const getInputNumber = {
    'type': 'getInputNumber',
    'message0': '获取输入的第几个数：%1',
    'args0': [
        {
            'type': 'input_value',
            'name': 'which'
        }
    ],
    'colour': 93,
    'tooltip': '获取输入的第几个数',
    'output': 'String'
};

wordGenerator.forBlock['getInputNumber'] = function (block, generator)
{
    const which = generator.valueToCode(block, 'which', Order.NONE) || '';

    return [`(数:${String(which)})`, Order.NONE];
};

export const getInputNumberTools = {
    kind: 'block',
    type: 'getInputNumber',
    inputs: {
        which: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '0'
                }
            }
        }
    },
};
