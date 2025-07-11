import * as Blockly from "blockly/core";
import { Order, pythonGenerator } from "blockly/python";

type DataFrameDropColumnBlock = Blockly.Block & IDataFrameDropColumn;
interface IDataFrameDropColumn extends DataFrameDropColumnType {}
type DataFrameDropColumnType = typeof DATA_FRAME_DROP_COLUMN;

export const DATA_FRAME_DROP_COLUMN_KEY = "dataframe_column_drop";

export const DATA_FRAME_DROP_COLUMN = {
  init(this: DataFrameDropColumnBlock): void {
    this.appendValueInput("df").setCheck("DataFrame").appendField("DataFrame");
    this.appendValueInput("columns")
      .appendField("の列")
      .setCheck(["Array", "String"]);
    this.appendDummyInput().appendField("を削除");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip("");
  },
};

Blockly.Blocks[DATA_FRAME_DROP_COLUMN_KEY] = DATA_FRAME_DROP_COLUMN;
pythonGenerator.forBlock[DATA_FRAME_DROP_COLUMN_KEY] = (block, generator) => {
  const df = generator.valueToCode(block, "df", Order.NONE) || "df";
  let columns = generator.valueToCode(block, "columns", Order.NONE) || "[]";
  columns = columns.startsWith("[") ? columns : `[${columns}]`;

  return `${df}.drop(columns=[str(col) for col in ${columns}])\n`;
};
