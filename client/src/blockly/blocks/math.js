// 四则运算

import { wordGenerator, Order } from '../generators/word';

export const math = {
    'type': 'math',
    'message0': '数学运算：\n数字1：%1 \n操作： %2 \n数字2：%3',
    'args0': [
        {
            'type': 'input_value',
            'name': 'number1'
        },
        {
            "type": "field_dropdown",
            "name": "relation",
            "options": [
                ["加", "+"],
                ["减", "-"],
                ["乘", "*"],
                ["除", "/"],
            ]
        },
        {
            'type': 'input_value',
            'name': 'number2'
        }
    ],
    'colour': 85,
    'tooltip': '四则运算',
    'output': 'String'
};

wordGenerator.forBlock['math'] = function (block, generator)
{
    const number1 = generator.valueToCode(block, 'number1', Order.NONE) || '';
    // const relation = generator.valueToCode(block, 'relation', Order.NONE) || '';
    const relation = block.getFieldValue('relation') || '';
    const number2 = generator.valueToCode(block, 'number2', Order.NONE) || '';

    return [`(算:${String(number1)}:${relation}:${String(number2)})`, Order.NONE];
};

export const mathTools = {
    kind: 'block',
    type: 'math',
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
