import * as Blockly from "blockly/core";
import { Order, pythonGenerator } from "blockly/python";
import { CsvFileDropdown } from "../../fields";
import { BLOCKLY_VARIABLE_DATA_FRAME } from "../../variable_types";

type DataFrameReadCsvBlock = Blockly.Block & IDataFrameReadCsv;
interface IDataFrameReadCsv extends DataFrameReadCsvType {}
type DataFrameReadCsvType = typeof DATA_FRAME_READ_CSV;

export const DATA_FRAME_READ_CSV_KEY = "dataframe_read_csv";

export const DATA_FRAME_READ_CSV = {
  init(this: DataFrameReadCsvBlock): void {
    this.appendDummyInput()
      .appendField("csvファイル")
      .appendField(new CsvFileDropdown(), "CSV_FILE");
    this.setOutput(true, BLOCKLY_VARIABLE_DATA_FRAME);
    this.setColour(210);
    this.setTooltip("選択したCSVファイルをDataframeとして返します。");
  },
};

Blockly.Blocks[DATA_FRAME_READ_CSV_KEY] = DATA_FRAME_READ_CSV;
pythonGenerator.forBlock[DATA_FRAME_READ_CSV_KEY] = (block, generator) => {
  const fileName = block.getFieldValue("CSV_FILE");
  (generator as any).definitions_["import_pandas"] = "import pandas as pd";
  const code = `pd.read_csv('/home/pyodide/${fileName}')`;
  return [code, Order.ATOMIC];
};
