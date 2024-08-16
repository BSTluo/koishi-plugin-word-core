// 生成随机数

import { wordGenerator, Order } from '../generators/word';

export const random = {
    'type': 'random',
    'message0': '生成随机数：\n最小值：%1 \n最大值： %2',
    'args0': [
        {
            'type': 'input_value',
            'name': 'number1'
        },
        {
            'type': 'input_value',
            'name': 'number2'
        }
    ],
    'colour': 105,
    'tooltip': '随机数生成',
    'output': 'String'
};

wordGenerator.forBlock['random'] = function (block, generator)
{
    const number1 = generator.valueToCode(block, 'number1', Order.NONE) || '';
    
    const number2 = generator.valueToCode(block, 'number2', Order.NONE) || '';

    return [`(~:${String(number1)}:${String(number2)})`, Order.NONE];
};

export const randomTools = {
    kind: 'block',
    type: 'random',
    inputs: {
        number1: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '1'
                }
            }
        },
        number2: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '1'
                }
            }
        }
    },
};
