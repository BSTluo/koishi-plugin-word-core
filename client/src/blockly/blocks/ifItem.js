import {wordGenerator, Order} from '../generators/word';

export const ifItem1 = {
  'type': 'ifItem1',
  'tooltip': '判断背包内物品的数量是否满足条件',
  'colour': 96,
  'output': 'String',
  'message0': '当满足 %1 %2 %3 时，继续运行',
  'args0': [
    {
      'type': 'input_value',
      'name': 'itemName',
      'check': 'String'
    },
    {
      'type': 'field_dropdown',
      'name': 'relationship',
      "options": [
        [">", ">"],
        ["<","<"],
        ["==","=="],
        ["!=","!="],
        [">=",">="],
        ["<=","<="]
      ]
    },
    {
      'type': 'input_value',
      'name': 'itemAmount'
    }
  ]
}

export const ifItem2 = {
  'type': 'ifItem2',
  'tooltip': '判断背包内物品的数量是否满足条件',
  'colour': 85,
  'output': 'String',
  'message0': '当满足 %1 %2 %3 时，执行 %4',
  'args0': [
    {
      'type': 'input_value',
      'name': 'itemName',
      'check': 'String'
    },
    {
      'type': 'field_dropdown',
      'name': 'relationship',
      "options": [
        [">", ">"],
        ["<","<"],
        ["==","=="],
        ["!=","!="],
        [">=",">="],
        ["<=","<="]
      ]
    },
    {
      'type': 'input_value',
      'name': 'itemAmount'
    },
    {
      'type': 'input_value',
      'name': 'msg',
      'check': 'String'
    }
  ]
}

wordGenerator.forBlock['ifItem1'] = function (block, generator)
{
    const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
    const relationship = block.getFieldValue('relationship');
    const itemAmount = generator.valueToCode(block, 'itemAmount', Order.NONE) || '';
    return [`(?:${itemName}:${relationship}:${String(itemAmount)})`, Order.NONE];
};

wordGenerator.forBlock['ifItem2'] = function (block, generator)
{
    const itemName = generator.valueToCode(block, 'itemName', Order.NONE) || '';
    const relationship = block.getFieldValue('relationship');
    const itemAmount = generator.valueToCode(block, 'itemAmount', Order.NONE) || '';
    const msg = generator.valueToCode(block, 'msg', Order.NONE) || '';
    return [`(?:${itemName}:${relationship}:${String(itemAmount)}:${msg})`, Order.NONE];
};

export const ifItem1Tools = {
  kind: 'block',
  type: 'ifItem1',
  inputs: {
    itemName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '物品名称/数量'
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
}

export const ifItem2Tools = {
  kind: 'block',
  type: 'ifItem2',
  inputs: {
    itemName: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '物品名称/数量'
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
    msg: {
      "shadow": {
        "type": "text",
        "fields": {
          "TEXT": '执行的语句'
        }
      }
    }
  },
}