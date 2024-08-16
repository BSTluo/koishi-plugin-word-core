// 隐式返回
import { wordGenerator, Order } from '../generators/word';

export const hidden = {
    'type': 'hidden',
    'message0': '执行内容后隐藏：%1',
    'colour': 95,
    'args0': [
        {
            'type': 'input_value',
            'name': 'args',
            'check': 'String'
        }
    ],
    'tooltip': '执行并隐藏返回值',
    'output': 'String'
};

wordGenerator.forBlock['hidden'] = function (block, generator)
{
    const args = generator.valueToCode(block, 'args', Order.NONE) || '';
    return [`(!:${args})`, Order.NONE];
};

export const hiddenTools = {
    kind: 'block',
    type: 'hidden'
};