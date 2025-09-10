import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_make_pipeline.py';

export const SKLEARN_MAKE_PIPELINE = 'sklearn_make_pipeline';

Blockly.Blocks[SKLEARN_MAKE_PIPELINE] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('STEPS')
      .setCheck([VariableTypes.Array, VariableTypes.Transformer])
      .appendField('パイプラインを作成');
    this.setOutput(true, VariableTypes.Pipeline);
    this.setColour(250);
    this.setTooltip(
      '変換器や推定器のリストからscikit-learnパイプラインを作成します。',
    );
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_MAKE_PIPELINE] = (block, generator) => {
  const stepsBlock = block.getInputTargetBlock('STEPS');
  let finalStepsListCode = '[]'; // Default to empty list

  if (stepsBlock) {
    if (stepsBlock?.type === 'lists_create_with') {
      const pythonSteps: string[] = [];
      for (let i = 0; ; i++) {
        const input = stepsBlock.getInput(`ADD${i}`);
        if (!input) break;

        const connectedBlock = input.connection?.targetBlock();
        if (connectedBlock) {
          const stepCodeTuple = generator.blockToCode(connectedBlock);
          const stepCode = Array.isArray(stepCodeTuple)
            ? stepCodeTuple[0]
            : stepCodeTuple;
          if (stepCode && stepCode !== 'None') {
            pythonSteps.push(stepCode);
          }
        }
      }
      finalStepsListCode = `${pythonSteps.join(', ')}`;
    } else {
      const singleStepCode = generator.valueToCode(
        stepsBlock,
        'STEPS',
        Order.NONE,
      );
      if (singleStepCode && singleStepCode !== 'None') {
        finalStepsListCode = `[${singleStepCode}]`;
      }
    }
  }

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_STEPS_LIST__: finalStepsListCode,
  });

  return [code, Order.FUNCTION_CALL];
};
