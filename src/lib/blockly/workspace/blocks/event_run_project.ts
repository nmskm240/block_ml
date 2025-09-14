import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

import { applyPlaceholders, stripImports } from '../utils';
import template from './template/event_run_project.py';

export const EVENT_RUN_PROJECT = 'event_run_project';

Blockly.Blocks[EVENT_RUN_PROJECT] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('プロジェクト実行開始');
    this.appendStatementInput('DO').setCheck(null);
    this.setColour(230);
    this.setTooltip('プロジェクトの実行を開始します。');
    this.setHelpUrl('');
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  },
};

pythonGenerator.forBlock['event_run_project'] = (block, generator) => {
  const statements_do = generator.statementToCode(block, 'DO');
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_func_name__: generator.FUNCTION_NAME_PLACEHOLDER_,
    __BLOCKLY_func_body__: statements_do.trim(),
  });
  generator.provideFunction_('main', code);
  return null;
};
