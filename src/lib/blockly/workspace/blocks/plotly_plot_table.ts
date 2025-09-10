import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/plotly_plot_table.py';

export const PLOTLY_PLOT_TABLE = 'plotly_plot_table';

const COLUMN_SIZE = 200;

Blockly.Blocks[PLOTLY_PLOT_TABLE] = {
  init: function () {
    this.appendValueInput('df')
      .setCheck(VariableTypes.Dataframe)
      .appendField('表表示');
    this.appendDummyInput()
      .appendField('タイトル')
      .appendField(new Blockly.FieldTextInput('データ表'), 'title');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('DataFrameを表として表示します');
  },
};

pythonGenerator.forBlock[PLOTLY_PLOT_TABLE] = (block, generator) => {
  const title = block.getFieldValue('title');
  const dfCode = generator.valueToCode(block, 'df', Order.NONE) || 'df';
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: dfCode,
    __BLOCKLY_title__: `'${title}'`,
    __BLOCKLY_column_size__: COLUMN_SIZE.toString(),
  });
  return code;
};
