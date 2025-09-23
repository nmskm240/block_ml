import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { DataframeColumnDtypeDropdown } from '../fields';
import { DataframeColumnDtype, VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import { SKLEARN_SELECT_ENCODER } from './sklearn_select_encoder';
import template from './template/sklearn_column_transformer.py';
import itemTemplate from './template/sklearn_column_transformer_item.py';

export const SKLEARN_COLUMN_TRANSFORMER = 'sklearn_column_transformer';
export const SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE =
  'sklearn_column_transformer_item_dtype';
export const SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN =
  'sklearn_column_transformer_item_column';

enum Args {
  Transformer = 'TRANSFORMER',
  Target = 'TARGET_VALUE',
}

Blockly.Blocks[SKLEARN_COLUMN_TRANSFORMER] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('ColumnTransformerを作成');
    this.appendStatementInput(Args.Transformer).setCheck([
      SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE,
      SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN,
    ]);
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks[SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput(Args.Target)
      .appendField('dtype')
      .appendField(new DataframeColumnDtypeDropdown(), Args.Target)
      .appendField('を');
    this.appendValueInput(Args.Transformer)
      .appendField('変換器')
      .setCheck(VariableTypes.Transformer)
      .setShadowDom(createShadowBlock(SKLEARN_SELECT_ENCODER));
    this.appendDummyInput().appendField('で変換する');

    this.setPreviousStatement(true, [
      SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE,
      SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN,
    ]);
    this.setNextStatement(true, [
      SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE,
      SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN,
    ]);
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },

  onchange: function (this: Blockly.Block) {
    if (this.getSurroundParent()?.type !== SKLEARN_COLUMN_TRANSFORMER) {
      this.unplug(true);
    }
  },
};

Blockly.Blocks[SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput(Args.Target)
      .appendField('列')
      .setCheck(VariableTypes.String)
      .setShadowDom(createShadowBlock('text'));
    this.appendDummyInput().appendField('を');
    this.appendValueInput(Args.Transformer)
      .appendField('変換器')
      .setCheck(VariableTypes.Transformer)
      .setShadowDom(createShadowBlock(SKLEARN_SELECT_ENCODER));
    this.appendDummyInput().appendField('で変換する');

    this.setPreviousStatement(true, [
      SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE,
      SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN,
    ]);
    this.setNextStatement(true, [
      SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE,
      SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN,
    ]);
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },

  onchange: function (this: Blockly.Block) {
    if (this.getSurroundParent()?.type !== SKLEARN_COLUMN_TRANSFORMER) {
      this.unplug(true);
    }
  },
};

pythonGenerator.forBlock[SKLEARN_COLUMN_TRANSFORMER] = (block, generator) => {
  const transformers = generator.statementToCode(block, Args.Transformer);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_TRANSFORMERS__: transformers,
  });
  return [code, Order.NONE];
};

pythonGenerator.forBlock[SKLEARN_COLUMN_TRANSFORMER_ITEM_DTYPE] = (
  block,
  generator,
) => {
  const dtype = block.getFieldValue(Args.Target) as DataframeColumnDtype;
  const transformer = generator.valueToCode(
    block,
    Args.Transformer,
    Order.NONE,
  );

  const body = stripImports(itemTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_LABEL_: `'${block.id}'`,
    __BLOCKLY_TRANSFORMER__: transformer,
    __BLOCKLY_COLUMN_PATTERN__: 'None',
    __BLOCKLY_COLUMN_DTYPE__: dtype,
  });
  return `${code}\n`;
};

pythonGenerator.forBlock[SKLEARN_COLUMN_TRANSFORMER_ITEM_COLUMN] = (
  block,
  generator,
) => {
  const column = generator.valueToCode(block, Args.Target, Order.NONE);
  const transformer = generator.valueToCode(
    block,
    Args.Transformer,
    Order.NONE,
  );

  const body = stripImports(itemTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_LABEL_: `'${block.id}'`,
    __BLOCKLY_TRANSFORMER__: transformer,
    __BLOCKLY_COLUMN_PATTERN__: column,
    __BLOCKLY_COLUMN_DTYPE__: 'None',
  });
  return `${code}\n`;
};
