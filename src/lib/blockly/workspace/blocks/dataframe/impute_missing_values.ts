import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../../../types/variables';

export const DATA_FRAME_IMPUTE_MISSING_VALUES =
  'dataframe_impute_missing_values';

Blockly.Blocks[DATA_FRAME_IMPUTE_MISSING_VALUES] = {
  init: function () {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df')
      .appendField('の欠損値を')
      .appendField(
        new Blockly.FieldDropdown([
          ['平均値', 'mean'],
          ['中央値', 'median'],
          ['最頻値', 'most_frequent'],
          // TODO: 定数対応は後でする
          // ["定数", "constant"],
        ]),
        'STRATEGY'
      )
      .appendField('で補完する');
    // TODO: 定数対応は後でする
    // this.appendValueInput("FILL_VALUE")
    //   .setCheck(["Number", "String"])
    //   .appendField("（定数補完の場合）")
    //   .setVisible(false); // 最初は非表示
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(230); // DataFrameブロックと同じ色
    this.setTooltip('指定したデータフレームの欠損値を補完します。');
    this.setHelpUrl(''); // TODO: ヘルプURLを設定

    // TODO: 定数対応は後でする
    // this.setOnChange((event: Blockly.Events.Abstract) => {
    //   if (event.type === Blockly.Events.BLOCK_CHANGE) {
    //     const strategy = this.getFieldValue("STRATEGY");
    //     const fillValueInput = this.getInput("FILL_VALUE");
    //     if (fillValueInput) {
    //       fillValueInput.setVisible(strategy === "constant");
    //     }
    //   }
    // });
  },
};

pythonGenerator.forBlock[DATA_FRAME_IMPUTE_MISSING_VALUES] = (
  block,
  generator
) => {
  const df = block.getField('df')?.getText() || 'df';
  const strategy = block.getFieldValue('STRATEGY');

  (generator as any).definitions_['import_simple_imputer'] =
    'from sklearn.impute import SimpleImputer';
  (generator as any).definitions_['import_numpy'] = 'import numpy as np';

  const code = `${df}.assign(**{
    col: SimpleImputer(strategy="${strategy}").fit_transform(df[[col]])[:, 0]
    for col in df.select_dtypes(include=np.number).columns
  })`;

  return [code, Order.FUNCTION_CALL];
};
