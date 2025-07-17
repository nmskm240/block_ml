import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";

export const CHART_PLOT_BLOCK_KEY = "chart_plot";

Blockly.Blocks[CHART_PLOT_BLOCK_KEY] = {
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
          ["ヒストグラム", "histogram"],
          ["箱ひげ図", "box"],
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

pythonGenerator.forBlock[CHART_PLOT_BLOCK_KEY] = (block, generator) => {
  const xCol = block.getFieldValue("X_COLUMN");
  const yCol = block.getFieldValue("Y_COLUMN");
  const chartType = block.getFieldValue("CHART_TYPE");
  const dfCode = generator.valueToCode(block, "DF", Order.NONE) || "df";
  const useJupyterMode = false; // TODO: フラグで切り替えられるように

  (generator as any).definitions_["import_plotly"] =
    "import plotly.express as px";
  (generator as any).definitions_["import_json"] = "import json";

  if (useJupyterMode) {
    return `fig = px.${chartType}(${dfCode}, x="${xCol}", y="${yCol}")\nfig.show()\n`;
  }

  // ヒストグラムの場合はy軸を使わない
  if (chartType === "histogram") {
    return `fig = px.histogram(${dfCode}, x="${xCol}")\n__render_plotly_json(fig.to_json())\n`;
  }

  return `\nfig = px.${chartType}(${dfCode}, x="${xCol}", y="${yCol}")\n__render_plotly_json(fig.to_json())\n`;
};
