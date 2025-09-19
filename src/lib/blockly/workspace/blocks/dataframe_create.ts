import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_create.py';

export const DATAFRAME_CREATE = 'dataframe_create';

enum Args {
  Columns = 'COLUMNS',
  Key = 'KEY',
  Value = 'VALUE',
}

Blockly.Blocks[DATAFRAME_CREATE] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('DataFrameを作成');
    this.appendStatementInput(Args.Columns).setCheck(
      VariableTypes.DataFrameColumn,
    );
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(210);
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[DATAFRAME_CREATE] = (block, generator) => {
  const columns = generator.statementToCode(block, Args.Columns);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_columns__: columns,
  });

  return [code, Order.FUNCTION_CALL];
};

export const DATAFRAME_COLUMN = 'dataframe_column';

Blockly.Blocks[DATAFRAME_COLUMN] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput(Args.Value)
      .appendField('Dataframeの列')
      .appendField(new Blockly.FieldTextInput('col1'), Args.Key)
      .appendField(':')
      .setCheck(VariableTypes.Array);
    this.setPreviousStatement(true, VariableTypes.DataFrameColumn);
    this.setNextStatement(true, VariableTypes.DataFrameColumn);
    this.setTooltip('DataFrameの1列分のデータと名前');
    this.setColour(210);
  },

  onchange: function (this: Blockly.Block) {
    if (
      !this.getSurroundParent() ||
      this.getSurroundParent()!.type !== DATAFRAME_CREATE
    ) {
      this.unplug(true);
    }
  },
};

pythonGenerator.forBlock[DATAFRAME_COLUMN] = (block, generator) => {
  const key = block.getFieldValue(Args.Key);
  const value = generator.valueToCode(block, Args.Value, Order.NONE) || [];
  return `'${key}': ${value},\n`;
};
