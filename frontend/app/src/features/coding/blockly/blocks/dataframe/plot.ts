import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";

export const DATA_FRAME_PLOT_BLOCK_KEY = "plot_block";

Blockly.Blocks[DATA_FRAME_PLOT_BLOCK_KEY] = {
  init: function () {
    this.appendDummyInput()
      .appendField("グラフ表示")
      .appendField("x列")
      .appendField(new Blockly.FieldTextInput("x"), "X_COLUMN")
      .appendField("y列")
      .appendField(new Blockly.FieldTextInput("y"), "Y_COLUMN")
      .appendField("種類")
      .appendField(
        new Blockly.FieldDropdown([
          ["散布図", "scatter"],
          ["折れ線", "line"],
          ["棒グラフ", "bar"],
        ]),
        "CHART_TYPE"
      );

    this.appendValueInput("DF").setCheck("DataFrame").appendField("対象DF");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("指定された列でグラフを描画します");
  },
};

pythonGenerator.forBlock[DATA_FRAME_PLOT_BLOCK_KEY] = (block, generator) => {
  const xCol = block.getFieldValue("X_COLUMN");
  const yCol = block.getFieldValue("Y_COLUMN");
  const chartType = block.getFieldValue("CHART_TYPE");
  const dfCode = generator.valueToCode(block, "DF", Order.NONE) || "df";

  const useJupyterMode = false; // TODO: フラグで切り替えられるように

  if (useJupyterMode) {
    (generator as any).definitions_["import_plotly"] =
      "import plotly.express as px";

    return `fig = px.${chartType}(${dfCode}, x="${xCol}", y="${yCol}")\nfig.show()\n`;
  } else {
    // 実行時（React + Plotly に渡すだけ）
    return `__render_plot(list(${dfCode}["${xCol}"]), list(${dfCode}["${yCol}"]), "${chartType}")\n`;
  }
};
