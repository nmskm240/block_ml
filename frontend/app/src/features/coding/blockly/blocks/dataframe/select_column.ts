import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";
import { FieldVariableDataFrame } from "../../variables";

export const DATA_FRAME_SELECT_COLUMN = "dataframe_select_column";

Blockly.Blocks[DATA_FRAME_SELECT_COLUMN] = {
  init: function () {
    this.appendDummyInput("")
      .appendField("DataFrame")
      .appendField(new FieldVariableDataFrame("df"), "df");
    this.appendValueInput("columns")
      .appendField("の列")
      .setCheck(["Array", "String"]);
    this.appendDummyInput().appendField("を取得");
    this.setOutput(true);
    this.setColour(260);
  },
};

pythonGenerator.forBlock[DATA_FRAME_SELECT_COLUMN] = (block, generator) => {
  const df = block.getField("df")?.getText() || "df";
  let columns = generator.valueToCode(block, "columns", Order.NONE) || "[]";
  columns = columns.startsWith("[") ? columns : `[${columns}]`;
  return [`${df}${columns}`, Order.ATOMIC];
};
