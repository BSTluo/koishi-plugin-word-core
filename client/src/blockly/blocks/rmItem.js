import { wordGenerator, Order } from '../generators/word';

export const rmItem1 = {
    'type': 'rmItem1',
    'message0': '从 触发者 移除：%1 数量：%2个',
    'args0': [
        {
            'type': 'input_value',
            'name': 'itemName',
            'check': 'String'
        },
        {
            'type': 'input_value',
            'name': 'itemAmount'
        }
    ],
    'colour': 85,
    'tooltip': '从触发者处移除一些物品',
    'output': 'String'
};

export const rmItem2 = {
    'type': 'rmItem2',
    'message0': '从%3移除：%1 数量：%2个',
    'args0': [
        {
            'type': 'input_value',
            'name': 'itemName',
            'check': 'String'
        },
        {
            'type': 'input_value',
            'name': 'itemAmount'
        },
        {
            'type': 'input_value',
            'name': 'who',
            'check': 'String'
        }
    ],
    'colour': 85,
    'tooltip': '从某人处移除一些物品',
    'output': 'String'
};

wordGenerator.forBlock['rmItem1'] = function (block, generator)
{
    const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
    const itemAmount = generator.valueToCode(block, 'itemAmount', Order.NONE) || '';

    return [`(-:${itemName}:${String(itemAmount)})`, Order.NONE];
};

wordGenerator.forBlock['rmItem2'] = function (block, generator)
{
    const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
    const itemAmount = generator.valueToCode(block, 'itemAmount', Order.NONE) || '';
    const who = generator.valueToCode(block, 'who', Order.NONE) || '';

    return [`(-:${itemName}:${String(itemAmount)}:${who})`, Order.NONE];
};

export const rmItem1Tools =
{
    kind: 'block',
    type: 'rmItem1',
    inputs: {
        itemName: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '物品名称'
                }
            }
        },
        itemAmount: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '物品数量'
                }
            }
        }
    },
};

export const rmItem2Tools =
{
    kind: 'block',
    type: 'rmItem2',
    inputs: {
        itemName: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '物品名称'
                }
            }
        },
        itemAmount: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '物品数量'
                }
            }
        },
        who: {
            "shadow": {
                "type": "text",
                "fields": {
                    "TEXT": '用户id'
                }
            }
        }
    },
};