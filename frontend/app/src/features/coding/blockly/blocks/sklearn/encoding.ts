// import * as Blockly from "blockly/core";
// import { pythonGenerator, Order } from "blockly/python";
// import { FieldVariableDataFrame } from "../../variables";

// export const SK_LEARN_ENCODER = "sk_learn_encoder";

// Blockly.Blocks[SK_LEARN_ENCODER] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField("エンコーディング")
//       .appendField(new Blockly.FieldVariable())
//       .appendField();
//     this.appendValueInput("TARGET").setCheck(null).appendField("対象列");
//     this.setOutput(true, new FieldVariableDataFrame());
//     this.setColour(200);
//     this.setTooltip("ラベルエンコーディング（カテゴリ→数値）します");
//   },
// };

// pythonGenerator.forBlock[SK_LEARN_ENCODER] = (block, generator) => {
//   const varName = generator.getVariableName("model") || "model";
//   const xCode = generator.valueToCode(block, "X", Order.NONE) || "X";
//   const yCode = generator.valueToCode(block, "Y", Order.NONE) || "y";
//   return `${varName}.fit(${xCode}, ${yCode})\n`;
// };
