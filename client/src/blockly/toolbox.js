/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { addItem1Tools, addItem2Tools } from "./blocks/addItem";
import { cd1Tools, cd2Tools } from "./blocks/cd";
import { at1Tools, at2Tools } from "./blocks/createAt";
import { delay1Tools, delay2Tools } from "./blocks/delay";
import { getItemAmount1Tools, getItemAmount2Tools } from "./blocks/getItemAmount";
import { hiddenTools } from "./blocks/hidden";
import { ifItem1Tools, ifItem2Tools } from "./blocks/ifItem";
import { getInputNumberTools } from "./blocks/getInputNumber";
import { rmItem1Tools, rmItem2Tools } from "./blocks/rmItem";
import { thatIdTools } from "./blocks/thatTriggerId";
import { thatNameTools } from "./blocks/thatTriggerName";
import { thisIdTools } from "./blocks/thisTriggerId";
import { thisNameTools } from "./blocks/thisTriggerName";
import { inputNumberTools } from "./blocks/inputNumber";
import { mathTools } from "./blocks/math";
import { randomTools } from "./blocks/random";
import { dateTools } from "./blocks/date";
import { callTools } from "./blocks/call";
import { asyncCallTools } from "./blocks/asyncCall";
import { waitInput1Tools, waitInput2Tools } from "./blocks/waitInput";
import { permission1Tools, permission2Tools } from "./blocks/permission";
import { leaderboardTools } from "./blocks/leaderboard";
import { videoTools } from "./blocks/video";
import { musicTools } from "./blocks/music";
import { kick1Tools, kick2Tools } from "./blocks/kick";

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': '输入匹配',
      'categorystyle': 'logic_category',
      'contents': [
        inputNumberTools
      ]
    },
    {
      'kind': 'category',
      'name': '基本单元',
      'categorystyle': 'logic_category',
      'contents': [{
        kind: 'block',
        type: 'wordBaseBlock',
      },
      {
        kind: 'block',
        type: 'math_number'
      },
      {
        kind: 'block',
        type: 'text'
      },
        at1Tools,
        at2Tools,
        getInputNumberTools,
        dateTools,
        videoTools,
        musicTools,
        kick1Tools,
        kick2Tools
      ]
    },
    {
      'kind': 'category',
      'name': '逻辑单元',
      'categorystyle': 'logic_category',
      'contents': [
        ifItem1Tools,
        ifItem2Tools,
        permission1Tools,
        permission2Tools,
        callTools,
        asyncCallTools,
        waitInput1Tools,
        waitInput2Tools
      ]
    },
    {
      'kind': 'category',
      'name': '延迟与cd',
      'categorystyle': 'logic_category',
      'contents': [
        delay1Tools,
        delay2Tools,
        cd1Tools,
        cd2Tools
      ]
    },
    {
      'kind': 'category',
      'name': '物品数量相关',
      'categorystyle': 'logic_category',
      'contents': [
        addItem1Tools,
        addItem2Tools,
        rmItem1Tools,
        rmItem2Tools,
        getItemAmount1Tools,
        getItemAmount2Tools,
        leaderboardTools
      ]
    },
    {
      'kind': 'category',
      'name': '目标选择',
      'categorystyle': 'logic_category',
      'contents': [
        thatIdTools,
        thatNameTools,
        thisIdTools,
        thisNameTools
      ]
    },
    {
      'kind': 'category',
      'name': '隐式返回',
      'categorystyle': 'logic_category',
      'contents': [
        hiddenTools
      ]
    },
    {
      'kind': 'category',
      'name': '数学',
      'categorystyle': 'logic_category',
      'contents': [
        mathTools,
        randomTools
      ]
    }
  ],
};
