// 触发者id
import { wordGenerator, Order } from '../generators/word';

export const thisId = {
    'type': 'thisId',
    'message0': '触发者的id',
    'colour': 109,
    'tooltip': '获取触发此回答的用户的id',
    'output': 'String'
};

wordGenerator.forBlock['thisId'] = function (block, generator)
{
    return [`(#this)`, Order.NONE];
};

export const thisIdTools = {
    kind: 'block',
    type: 'thisId'
};