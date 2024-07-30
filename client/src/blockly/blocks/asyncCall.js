// 异步调用

import { wordGenerator, Order } from '../generators/word';

export const asyncCall = {
    'type': 'asyncCall',
    'message0': '异步地触发一个触发词：%1',
    'args0': [
        {
            'type': 'input_value',
            'name': 'question'
        }
    ],
    'colour': 85,
    'tooltip': '异步地触发一个触发词',
    'output': 'String'
};

wordGenerator.forBlock['asyncCall'] = function (block, generator)
{
    const question = generator.valueToCode(block, 'question', Order.NONE) || '';

    return [`(调:${String(question)})`, Order.NONE];
};

export const asyncCallTools = {
    kind: 'block',
    type: 'asyncCall',
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
