import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import path from 'path';
import { CsvFileDropdown } from '../../fields';
import { VariableTypes } from '../../../types/variables';

export const DATA_FRAME_READ_CSV_KEY = 'dataframe_read_csv';

Blockly.Blocks[DATA_FRAME_READ_CSV_KEY] = {
  init: function () {
    this.appendDummyInput()
      .appendField('CSVファイルを読み込む')
      .appendField(new CsvFileDropdown(), 'CSV_FILE');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(210);
    this.setTooltip('選択したCSVファイルをDataframeとして返します。');
  },
};

pythonGenerator.forBlock[DATA_FRAME_READ_CSV_KEY] = (block, generator) => {
  const fileName = block.getFieldValue('CSV_FILE');
  (generator as any).definitions_['import_pandas'] = 'import pandas as pd';
  const filePath = path.join(
    process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!,
    fileName
  );
  const code = `pd.read_csv('${filePath}')`;
  return [code, Order.ATOMIC];
};
