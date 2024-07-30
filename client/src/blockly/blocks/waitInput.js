// 等待输入文本

import { wordGenerator, Order } from '../generators/word';

export const waitInput1 = {
    'type': 'waitInput1',
    'message0': '等待输入：%1 的值',
    'args0': [
        {
            'type': 'input_value',
            'name': 'value'
        }
    ],
    'colour': 85,
    'tooltip': '等待输入文本',
    'output': 'String'
};

export const waitInput2 = {
    'type': 'waitInput2',
    'message0': '等待输入一个值',
    'colour': 85,
    'tooltip': '等待输入文本',
    'output': 'String'
};

wordGenerator.forBlock['waitInput1'] = function (block, generator)
{
    const value = generator.valueToCode(block, 'value', Order.NONE) || '';

    return [`(wi:${String(value)})`, Order.NONE];
};

wordGenerator.forBlock['waitInput2'] = function (block, generator)
{
    return [`(wi)`, Order.NONE];
};

export const waitInput1Tools = {
    kind: 'block',
    type: 'waitInput1',
    inputs: {
        value: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '物品名称'
                }
            }
        }
    },
};

export const waitInput2Tools = {
    kind: 'block',
    type: 'waitInput2'
};

