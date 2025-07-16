import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";
import {
  FieldVariableSklearnModel,
} from "../../variables";
import { BLOCKLY_VARIABLE_DATA_FRAME } from "../../variable_types";

export const SK_LEARN_FIT_MODEL = "sk_learn_predicate";

Blockly.Blocks[SK_LEARN_FIT_MODEL] = {
  init: function () {
    this.appendDummyInput("")
      .appendField("モデル")
      .appendField(new FieldVariableSklearnModel("model"))
      .appendField("を");
    this.appendValueInput("X")
      .appendField("学習データ")
      .setCheck(BLOCKLY_VARIABLE_DATA_FRAME);
    this.appendValueInput("Y")
      .appendField("正解データ")
      .setCheck(BLOCKLY_VARIABLE_DATA_FRAME);
    this.appendDummyInput("").appendField("で学習させる");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour(120);
  },
};

pythonGenerator.forBlock[SK_LEARN_FIT_MODEL] = (block, generator) => {
  const varName = block.getField("model")?.getText() || "model";
  const xCode = generator.valueToCode(block, "X", Order.NONE) || "X";
  const yCode = generator.valueToCode(block, "Y", Order.NONE) || "y";
  return `${varName}.fit(${xCode}, ${yCode})\n`;
};
