import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

export const CHART_PLOT_BLOCK_KEY = 'chart_plot';

Blockly.Blocks[CHART_PLOT_BLOCK_KEY] = {
  init: function () {
    this.appendValueInput('DF').setCheck('DataFrame').appendField('グラフ描画');
    this.appendDummyInput()
      .appendField('タイトル')
      .appendField(new Blockly.FieldTextInput('グラフ'), 'TITLE')
      .appendField('x列')
      .appendField(new Blockly.FieldTextInput('x'), 'X_COLUMN')
      .appendField('y列')
      .appendField(new Blockly.FieldTextInput('y'), 'Y_COLUMN')
      .appendField('種類')
      .appendField(
        new Blockly.FieldDropdown([
          ['散布図', 'scatter'],
          ['折れ線', 'line'],
          ['棒グラフ', 'bar'],
          ['ヒストグラム', 'histogram'],
          ['箱ひげ図', 'box'],
        ]),
        'CHART_TYPE',
      );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip('指定された列でグラフを描画します');
  },
};

pythonGenerator.forBlock[CHART_PLOT_BLOCK_KEY] = (block, generator) => {
  const title = block.getFieldValue('TITLE');
  const xCol = block.getFieldValue('X_COLUMN');
  const yCol = block.getFieldValue('Y_COLUMN');
  const chartType = block.getFieldValue('CHART_TYPE');
  const dfCode = generator.valueToCode(block, 'DF', Order.NONE) || 'df';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (generator as any).definitions_['import_plotly'] =
    'import plotly.express as px';

  let plotCode;
  // ヒストグラムの場合はy軸を使わない
  if (chartType === 'histogram') {
    plotCode = `px.histogram(${dfCode}, x="${xCol}", title="${title}")`;
  } else {
    plotCode = `px.${chartType}(${dfCode}, x="${xCol}", y="${yCol}", title="${title}")`;
  }

  return `
fig = ${plotCode}
print(fig.to_json())\n
`;
};
