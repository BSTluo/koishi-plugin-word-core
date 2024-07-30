// 被at人id
import { wordGenerator, Order } from '../generators/word';

export const thatId = {
    'type': 'thatId',
    'message0': '被at的id',
    'colour': 85,
    'tooltip': '获取触发中at的id',
    'output': 'String'
};

wordGenerator.forBlock['thatId'] = function (block, generator)
{
    return [`(#that)`, Order.NONE];
};

export const thatIdTools = {
    kind: 'block',
    type: 'thatId'
};
