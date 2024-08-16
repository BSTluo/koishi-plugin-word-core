// 创建一个at

import { wordGenerator, Order } from '../generators/word';

export const at1 = {
    'type': 'at1',
    'message0': '@昵称：%1',
    'args0': [
        {
            'type': 'input_value',
            'name': 'name',
            'check': 'String'
        }
    ],
    'colour': 90,
    'tooltip': 'at一个人',
    'output': 'String'
};

export const at2 = {
    'type': 'at2',
    'message0': '@ID：%1',
    'args0': [
        {
            'type': 'input_value',
            'name': 'id',
            'check': 'String'
        }
    ],
    'colour': 90,
    'tooltip': 'at一个人',
    'output': 'String'
};

wordGenerator.forBlock['at1'] = function (block, generator)
{
    const name = generator.valueToCode(block, 'name', Order.NONE) || '';

    return [`(@:name:${String(name)})`, Order.NONE];
};

wordGenerator.forBlock['at2'] = function (block, generator)
{
    const id = generator.valueToCode(block, 'id', Order.NONE) || '';

    return [`(@:id:${String(id)})`, Order.NONE];
};

export const at1Tools = {
    kind: 'block',
    type: 'at1',
    inputs: {
        name: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '昵称'
                }
            }
        }
    },
};

export const at2Tools = {
    kind: 'block',
    type: 'at2',
    inputs: {
        id: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": 'id'
                }
            }
        }
    },
};