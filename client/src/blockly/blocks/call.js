// 解析一个触发词

import { wordGenerator, Order } from '../generators/word';

export const call = {
    'type': 'call',
    'message0': '触发一个触发词：%1',
    'args0': [
        {
            'type': 'input_value',
            'name': 'question'
        }
    ],
    'colour': 85,
    'tooltip': '触发一个触发词',
    'output': 'String'
};

wordGenerator.forBlock['call'] = function (block, generator)
{
    const question = generator.valueToCode(block, 'question', Order.NONE) || '';

    return [`(调:${String(question)})`, Order.NONE];
};

export const callTools = {
    kind: 'block',
    type: 'call',
    inputs: {
        question: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '触发词'
                }
            }
        }
    },
};
