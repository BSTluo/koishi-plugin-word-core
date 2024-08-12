import * as Blockly from 'blockly/core';

import { rmItem1, rmItem2 } from './rmItem';
import { addItem1, addItem2 } from './addItem';
import { ifItem1, ifItem2 } from './ifItem';
import { wordBaseBlock } from './base';
import { delay1, delay2 } from './delay';
import { getItemAmount1, getItemAmount2 } from './getItemAmount';
import { thatId } from './thatTriggerId';
import { thatName } from './thatTriggerName';
import { thisId } from './thisTriggerId';
import { thisName } from './thisTriggerName';
import { at1, at2 } from './createAt';
import { hidden } from './hidden';
import { cd1, cd2 } from './cd';
import { getInputNumber } from './getInputNumber';
import { inputNumber } from './inputNumber';
import { math } from './math';
import { random } from './random';
import { date } from './date';
import { call } from './call';
import { asyncCall } from './asyncCall';
import { waitInput1, waitInput2 } from './waitInput';
import { permission1, permission2 } from './permission';
import { leaderboard } from './leaderboard';
import { video } from './video';
import { music } from './music';
import { kick1, kick2 } from './kick';
import { inputAt } from './inputAt';

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    addItem1,
    addItem2,
    rmItem1,
    rmItem2,
    ifItem1,
    ifItem2,
    delay1,
    delay2,
    getItemAmount1,
    getItemAmount2,
    wordBaseBlock,
    thatId,
    thatName,
    thisId,
    thisName,
    at1,
    at2,
    hidden,
    cd1,
    cd2,
    getInputNumber,
    inputNumber,
    math,
    random,
    date,
    call,
    asyncCall,
    waitInput1,
    waitInput2,
    permission1,
    permission2,
    leaderboard,
    video,
    music,
    kick1,
    kick2,
    inputAt
]);