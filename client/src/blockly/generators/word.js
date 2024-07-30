import * as Blockly from 'blockly';

export const wordGenerator = new Blockly.Generator('Word');

export const Order = {
    ATOMIC: 0,            // 0 "" ...
    NONE: 99,             // (...)
};

wordGenerator.scrub_ = function (block, code, thisOnly)
{
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly)
    {
        return code + jsonGenerator.blockToCode(nextBlock);
    }
    return code;
};

wordGenerator.forBlock['math_number'] = function (block)
{
    const code = String(block.getFieldValue('NUM'));
    return [code, Order.ATOMIC];
};

wordGenerator.forBlock['text'] = function (block)
{
    const textValue = block.getFieldValue('TEXT');
    const code = `${textValue}`;
    return [code, Order.ATOMIC];
};
