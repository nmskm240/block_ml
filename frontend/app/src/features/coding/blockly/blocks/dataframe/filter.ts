import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";
import { FieldVariableDataFrame } from "../../variables";
import { BLOCKLY_VARIABLE_DATA_FRAME } from "../../variable_types";

export const DATA_FRAME_FILTER_BLOCK_KEY = "filter_block";

Blockly.Blocks[DATA_FRAME_FILTER_BLOCK_KEY] = {
    init: function() {
        this.appendDummyInput("")
            .appendField("DataFrame")
            .appendField(new FieldVariableDataFrame("df"), "df");
        this.appendValueInput("Condition").setCheck("Boolean").appendField("条件");
        this.appendDummyInput("抽出").appendField();
        this.setOutput(true, BLOCKLY_VARIABLE_DATA_FRAME);
        this.setColour(260);
        this.setTooltip("");
    },
};

pythonGenerator.forBlock[DATA_FRAME_FILTER_BLOCK_KEY] = (block, generator) => {
    const df = block.getField("df")?.getText() || "df";
    const condition = generator.valueToCode(block, "Condition", Order.NONE) || true;

    return [`${df}[${condition}]`, Order.ATOMIC];
};
