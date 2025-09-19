import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

import { applyPlaceholders, splitFunctions, stripImports } from '../utils';
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
  onchange: function (this: Blockly.Block, event: Blockly.Events.BlockCreate) {
    if (!this.workspace || !event.blockId) {
      return;
    }

    const blocks = this.workspace.getBlocksByType(EVENT_RUN_PROJECT, false);
    if (blocks.length > 1) {
      this.workspace.getBlockById(event.blockId)?.dispose();
    }
  },
};

pythonGenerator.forBlock['event_run_project'] = (block, generator) => {
  const statements_do = generator.statementToCode(block, 'DO');
  const body = stripImports(template, generator);
  let { funcs, usage } = splitFunctions(body);
  const mainFunc = generator.provideFunction_(
    'main',
    applyPlaceholders(funcs[0], {
      __BLOCKLY_func_name__: generator.FUNCTION_NAME_PLACEHOLDER_,
      __BLOCKLY_func_body__: statements_do.trim() || 'pass',
    }),
  );
  usage = applyPlaceholders(usage, {
    __BLOCKLY_func_name__: mainFunc,
  });
  return `${usage}\n`;
};
