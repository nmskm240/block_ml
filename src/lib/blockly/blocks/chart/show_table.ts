import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";

export const CHART_SHOW_TABLE_BLOCK_KEY = "chart_show_table";

Blockly.Blocks[CHART_SHOW_TABLE_BLOCK_KEY] = {
  init: function () {
    this.appendValueInput("DF").setCheck("DataFrame").appendField("表表示");
    this.appendDummyInput()
      .appendField("タイトル")
      .appendField(new Blockly.FieldTextInput("データ表"), "TITLE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("DataFrameを表として表示します");
  },
};

pythonGenerator.forBlock[CHART_SHOW_TABLE_BLOCK_KEY] = (block, generator) => {
  const title = block.getFieldValue("TITLE");
  const dfCode = generator.valueToCode(block, "DF", Order.NONE) || "df";

  (generator as any).definitions_["import_json"] = "import json";

  return `__show_table_json("${title}", ${dfCode}.to_json(orient='split'))`;
};
