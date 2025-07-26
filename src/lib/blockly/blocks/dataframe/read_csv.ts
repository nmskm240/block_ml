import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { CsvFileDropdown } from '../../fields';
import { VariableTypes } from '../../types/variables';
import path from 'path';

type DataFrameReadCsvBlock = Blockly.Block & IDataFrameReadCsv;
interface IDataFrameReadCsv extends DataFrameReadCsvType {}
type DataFrameReadCsvType = typeof DATA_FRAME_READ_CSV;

export const DATA_FRAME_READ_CSV_KEY = 'dataframe_read_csv';

export const DATA_FRAME_READ_CSV = {
  init(this: DataFrameReadCsvBlock): void {
    this.appendDummyInput()
      .appendField('CSVファイルを読み込む')
      .appendField(new CsvFileDropdown(), 'CSV_FILE');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(210);
    this.setTooltip('選択したCSVファイルをDataframeとして返します。');
  },
};

Blockly.Blocks[DATA_FRAME_READ_CSV_KEY] = DATA_FRAME_READ_CSV;
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
