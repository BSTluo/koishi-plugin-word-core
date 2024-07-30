// 触发者名字
import { wordGenerator, Order } from '../generators/word';

export const thisName = {
    'type': 'thisName',
    'message0': '触发者的昵称',
    'colour': 85,
    'tooltip': '获取触发此回答的用户的昵称',
    'output': 'String'
};

wordGenerator.forBlock['thisName'] = function (block, generator)
{
    return [`(@this)`, Order.NONE];
};

export const thisNameTools = {
    kind: 'block',
    type: 'thisName'
};
