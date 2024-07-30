// 获取时间

import { wordGenerator, Order } from '../generators/word';

export const date = {
    'type': 'date',
    'message0': '获取当前：%1',
    'args0': [
        {
            "type": "field_dropdown",
            "name": "type",
            "options": [
                ["年", "1"],
                ["月", "2"],
                ["星期几", "3"],
                ["日", "4"],
                ["时", "5"],
                ["分", "6"],
                ["秒", "7"],
                ["时间戳", "8"],
            ]
        }
    ],
    'colour': 85,
    'tooltip': '获取当前时间',
    'output': 'String'
};

wordGenerator.forBlock['date'] = function (block, generator)
{
    const type = block.getFieldValue('type') || '';

    return [`(time:${String(type)})`, Order.NONE];
};

export const dateTools = {
    kind: 'block',
    type: 'date'
};
