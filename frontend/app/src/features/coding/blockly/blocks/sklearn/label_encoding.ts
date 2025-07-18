import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";
import { BLOCKLY_VARIABLE_DATA_FRAME } from "../../variable_types";
import { FieldVariableDataFrame } from "../../variables";

export const SK_LEARN_LABEL_ENCODING = "sklearn_label_encoding";

Blockly.Blocks[SK_LEARN_LABEL_ENCODING] = {
  init: function () {
    this.appendDummyInput()
      .appendField("DataFrame")
      .appendField(new FieldVariableDataFrame("df"), "df")
      .appendField("を");
    this.appendValueInput("COLUMN")
      .setCheck("String")
      .appendField("の列");
    this.appendDummyInput()
      .appendField("をラベルエンコーディングする");
    this.setOutput(true, BLOCKLY_VARIABLE_DATA_FRAME);
    this.setColour(120); // Sklearnブロックと同じ色
    this.setTooltip("指定したデータフレームの列をラベルエンコーディングします。");
    this.setHelpUrl(""); // TODO: ヘルプURLを設定
  },
};

pythonGenerator.forBlock[SK_LEARN_LABEL_ENCODING] = (block, generator) => {
  const df = block.getField("df")?.getText() || "df";
  const column = generator.valueToCode(block, "COLUMN", Order.NONE) || "''";

  (generator as any).definitions_["import_label_encoder"] =
    "from sklearn.preprocessing import LabelEncoder";

  const code = `${df}.assign(**{${column}: LabelEncoder().fit_transform(${df}[${column}])})`;
  return [code, Order.FUNCTION_CALL];
};
