import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_custom_transformer_def.py';

export const SKLEARN_CUSTOM_TRANSFORMER_DEF = 'sklearn_custom_transformerdef';

Blockly.Blocks[SKLEARN_CUSTOM_TRANSFORMER_DEF] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('カスタム変換器')
      .appendField(
        new Blockly.FieldTextInput('name', (text) => {
          const valid = text.replace(/[^a-zA-Z0-9_]/g, '');
          return valid.length > 0 ? valid : 'func';
        }),
        'NAME',
      );
    this.appendEndRowInput()
      .appendField('変換対象')
      .appendField(new Blockly.FieldVariable('x'), 'X');
    this.appendStatementInput('BODY');
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_CUSTOM_TRANSFORMER_DEF] = (
  block,
  generator,
) => {
  const name = block.getFieldValue('NAME');
  const statementBody = generator.statementToCode(block, 'BODY').trim();
  const x = block.getField('X')?.getText() || "x";
  console.log(x)
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_func_name__: generator.FUNCTION_NAME_PLACEHOLDER_,
    __BLOCKLY_x__: x,
    __BLOCKLY_statement_body__: statementBody,
  });
  generator.provideFunction_(name, code);
  return null;
};
