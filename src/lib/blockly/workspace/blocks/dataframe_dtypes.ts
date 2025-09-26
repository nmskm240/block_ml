import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/dataframe_dtypes.py';

export const DATAFRAME_DTYPES = 'dataframe_dtypes';

enum Args {
  DataFrame = 'DATAFRAME',
}

Blockly.Blocks[DATAFRAME_DTYPES] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput(Args.DataFrame)
      .appendField('DataFrame')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }));
    this.appendDummyInput().appendField('の各列の型を確認');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('DataFrameの各列の型を出力します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[DATAFRAME_DTYPES] = (block, generator) => {
  const df = generator.valueToCode(block, Args.DataFrame, Order.NONE);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
  });

  return code;
};
