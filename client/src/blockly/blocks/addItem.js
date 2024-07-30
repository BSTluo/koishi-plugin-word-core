import { wordGenerator, Order } from '../generators/word';

export const addItem1 = {
    'type': 'addItem1',
    'message0': '为 触发者 添加：%1 数量：%2个',
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
    'tooltip': '添加物品给触发者',
    'output': 'String'
};

export const addItem2 = {
    'type': 'addItem2',
    'message0': '为%3添加：%1 数量：%2个',
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
    'tooltip': '添加物品给某人',
    'output': 'String'
};

wordGenerator.forBlock['addItem1'] = function (block, generator)
{
    const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
    const itemAmount = generator.valueToCode(block, 'itemAmount', Order.NONE) || '';

    return [`(+:${itemName}:${String(itemAmount)})`, Order.NONE];
};

wordGenerator.forBlock['addItem2'] = function (block, generator)
{
    const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
    const itemAmount = generator.valueToCode(block, 'itemAmount', Order.NONE) || '';
    const who = generator.valueToCode(block, 'who', Order.NONE) || '';

    return [`(+:${itemName}:${String(itemAmount)}:${who})`, Order.NONE];
};

export const addItem1Tools = {
    kind: 'block',
    type: 'addItem1',
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

export const addItem2Tools = {
    kind: 'block',
    type: 'addItem2',
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