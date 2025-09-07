import path from 'path';

import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { CsvFileDropdown } from '../fields';
import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_read_csv.py';

export const DATAFRAME_READ_CSV = 'dataframe_read_csv';

Blockly.Blocks[DATAFRAME_READ_CSV] = {
  init: function () {
    this.appendDummyInput()
      .appendField('CSVファイルを読み込む')
      .appendField(new CsvFileDropdown(), 'CSV_FILE');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(210);
    this.setTooltip('選択したCSVファイルをDataframeとして返します。');
  },
};

pythonGenerator.forBlock[DATAFRAME_READ_CSV] = (block, generator) => {
  const fileName = block.getFieldValue('CSV_FILE');
  const filePath = path.join(
    process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!,
    fileName,
  );
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_filePath__: filePath,
  });
  return [code, Order.FUNCTION_CALL];
};
