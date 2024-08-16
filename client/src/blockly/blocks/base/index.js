import { wordGenerator, Order } from '../../generators/word';
import * as Blockly from 'blockly';
import './plugin'

export const wordBaseBlock = {
  'type': 'wordBaseBlock',
  'message0': '问： %1',
  'args0': [
    {
      'type': 'input_value',
      'name': 'question',
      'check': 'String'
    }
  ],
  'colour': 87,
  'tooltip': '创建一个词库问答',
  'mutator': 'questTextList'
};

wordGenerator.forBlock['wordBaseBlock'] = function (block, generator)
{
  const question = generator.valueToCode(block, 'question', Order.NONE) || '';
  let answerList = [];
  // const who = generator.valueToCode(block, 'who', Order.ATOMIC) || '';
  for (let i = 0; i < block.itemCount_; i++)
  {
    const answer = generator.valueToCode(block, `answer${i}`, Order.NONE) || '';
    answerList.push(answer);
  }
  // return [`(-:${question}:${String(itemAmount)}:${who})`, Order.NONE];
  return `word.add "${question}" "${answerList.join('')}"`;
};
