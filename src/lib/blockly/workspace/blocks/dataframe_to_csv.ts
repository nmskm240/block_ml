import path from 'path';

import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_to_csv.py';

export const DATAFRAME_TO_CSV = 'dataframe_to_csv';

enum Args {
  Dataframe = 'DATAFRAME',
  FileName = 'FILE_NAME',
}

Blockly.Blocks[DATAFRAME_TO_CSV] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), Args.Dataframe)
      .appendField('をファイル名')
      .appendField(new Blockly.FieldTextInput('file'), Args.FileName)
      .appendField('で出力する');
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setColour(210);
    this.setTooltip('Dataframeをcsvで出力します');
  },
};

pythonGenerator.forBlock[DATAFRAME_TO_CSV] = (block, generator) => {
  const df = block.getField(Args.Dataframe)!.getText();
  const fileName = block.getFieldValue(Args.FileName);
  const filePath = path.join(
    process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!,
    `${fileName}.csv`,
  );
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_DF__: df,
    __BLOCKLY_FILE_PATH__: filePath,
  });
  return `${code}\n`;
};
