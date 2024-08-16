// cd语法

import { wordGenerator, Order } from '../generators/word';

export const cd1 = {
    'type': 'cd1',
    'message0': '消息cd\n名称：%1\n时常：%2 s\n作用在：全句',
    'args0': [
        {
            'type': 'input_value',
            'name': 'event'
        },
        {
            'type': 'input_value',
            'name': 'time'
        }
    ],
    'colour': 89,
    'tooltip': '延迟发送指定的消息',
    'output': 'String'
};

export const cd2 = {
    'type': 'cd2',
    'message0': '消息cd\n名称：%1\n时常：%2 s\n作用在：%3',
    'args0': [
        {
            'type': 'input_value',
            'name': 'event'
        },
        {
            'type': 'input_value',
            'name': 'time'
        },
        {
            'type': 'input_value',
            'name': 'msg'
        }
    ],
    'colour': 85,
    'tooltip': '延迟发送之后的消息',
    'output': 'String'
};

wordGenerator.forBlock['cd1'] = function (block, generator)
{
    const event = generator.valueToCode(block, 'event', Order.NONE) || 0;
    const time = generator.valueToCode(block, 'time', Order.NONE) || 0;

    return [`(cd:${event}:${time})`, Order.NONE];
};

wordGenerator.forBlock['cd2'] = function (block, generator)
{
    const event = generator.valueToCode(block, 'event', Order.NONE) || 0;
    const time = generator.valueToCode(block, 'time', Order.NONE) || 0;
    const msg = generator.valueToCode(block, 'msg', Order.NONE) || '';

    return [`(cd:${event}:${time}:${msg})`, Order.NONE];
};

export const cd1Tools = {
    kind: 'block',
    type: 'cd1',
    inputs: {
        event: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '事件1'
                }
            }
        },
        time: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '1'
                }
            }
        }
    },
};

export const cd2Tools = {
    kind: 'block',
    type: 'cd2',
    inputs: {
        event: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '事件1'
                }
            }
        },
        time: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '1'
                }
            }
        },
        msg: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '消息内容'
                }
            }
        }
    },
};