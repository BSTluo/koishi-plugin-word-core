// 被at人名字
import { wordGenerator, Order } from '../generators/word';

export const thatName = {
    'type': 'thatName',
    'message0': '被at的昵称',
    'colour': 85,
    'tooltip': '获取触发中at的昵称',
    'output': 'String'
};

wordGenerator.forBlock['thatName'] = function (block, generator)
{
    return [`(@that)`, Order.NONE];
};

export const thatNameTools = {
    kind: 'block',
    type: 'thatName'
};