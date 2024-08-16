import * as Blockly from 'blockly';

import { createPlusField } from '../src/field_plus';
import { createMinusField } from '../src/field_minus';
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Changes the text_join block to use a +/- mutator UI.
 */

const textJoinMutator = {
    /**
     * Number of text inputs on this block.
     * @type {number}
     */
    questCount_: 0,

    /**
     * Creates XML to represent number of inputs.
     * @returns {!Element} XML storage element.
     * @this {Blockly.Block}
     */
    mutationToDom: function ()
    {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.questCount_);
        return container;
    },

    /**
     * Parses XML to restore the inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this {Blockly.Block}
     */
    domToMutation: function (xmlElement)
    {
        const targetCount = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_(targetCount);
    },

    /**
     * Returns the state of this block as a JSON serializable object.
     * @returns {{itemCount: number}} The state of this block, ie the item count.
     */
    saveExtraState: function ()
    {
        return {
            itemCount: this.questCount_,
        };
    },

    /**
     * Applies the given state to this block.
     * @param {*} state The state to apply to this block, ie the item count.
     */
    loadExtraState: function (state)
    {
        this.updateShape_(state['itemCount']);
    },

    /**
     * Adds inputs to the block until the block reaches the target input count.
     * @param {number} targetCount The number of inputs the block should have.
     * @this {Blockly.Block}
     * @private
     */
    updateShape_: function (targetCount)
    {
        while (this.questCount_ < targetCount)
        {
            this.addQuestionPart_();
        }
        while (this.questCount_ > targetCount)
        {
            this.removeQuestionPart_();
        }
        this.updateMinus_();
    },

    /**
     * Callback for the plus image. Adds an input to the block and updates the
     * state of the minus.
     * @this {Blockly.Block}
     */
    plus: function ()
    {
        this.addQuestionPart_();
        this.updateMinus_();
    },

    /**
     * Callback for the minus image. Removes the input at the end of the block and
     * updates the state of the minus.
     * @this {Blockly.Block}
     */
    minus: function ()
    {
        if (this.questCount_ == 0)
        {
            return;
        }
        this.removeQuestionPart_();
        this.updateMinus_();
    },

    /**
     * Adds an input to the end of the block. If the block currently has no
     * inputs it updates the top 'EMPTY' input to receive a block.
     * @this {Blockly.Block}
     * @private
     */
    addQuestionPart_: function ()
    {
        if (this.questCount_ == 0)
        {
            if (this.getInput('EMPTY'))
            {
                this.removeInput('EMPTY');
            }
            this.topInput_ = this.appendValueInput('answer' + this.questCount_)
                .appendField(createPlusField(), 'PLUS')
                .appendField("答：");
        } else
        {
            this.appendValueInput('answer' + this.questCount_);
        }
        // Because item inputs are 0-index we decrement first, increment last.
        this.questCount_++;
    },

    /**
     * Removes an input from the end of the block. If we are removing the last
     * input this updates the block to have an 'EMPTY' top input.
     * @this {Blockly.Block}
     * @private
     */
    removeQuestionPart_: function ()
    {
        this.questCount_--;
        this.removeInput('answer' + this.questCount_);
        if (this.questCount_ == 0)
        {
            this.topInput_ = this.appendDummyInput('EMPTY')
                .appendField(createPlusField(), 'PLUS')
                .appendField(this.newQuote_(true))
                .appendField(this.newQuote_(false));
        }
    },

    /**
     * Makes it so the minus is visible iff there is an input available to remove.
     * @private
     */
    updateMinus_: function ()
    {
        const minusField = this.getField('MINUS');
        if (!minusField && this.questCount_ > 0)
        {
            this.topInput_.insertFieldAt(1, createMinusField(), 'MINUS');
        } else if (minusField && this.questCount_ < 1)
        {
            this.topInput_.removeField('MINUS');
        }
    },
};

/**
 * Adds the quotes mixin to the block. Also updates the shape so that if no
 * mutator is provided the block has two inputs.
 * @this {Blockly.Block}
 */
const textJoinHelper = function ()
{
    Blockly.Extensions.apply('quote_image_mixin', this, false);
    this.updateShape_(1);
};

if (Blockly.Extensions.isRegistered('questTextList'))
{
    Blockly.Extensions.unregister('questTextList');
}

Blockly.Extensions.registerMutator(
  'questTextList',
  textJoinMutator,
  textJoinHelper,
);
