import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { WithAdditionalWorkspace } from '../../types';

export const DATAFRAME_COLUMNS_DROPDOWN = 'dataframe_columns_dropdown';

const getColumns = function (this: Blockly.Block) {
  return [['(列を選択)', '']];
};

Blockly.Blocks[DATAFRAME_COLUMNS_DROPDOWN] = {
  init: function () {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df')
      .appendField('の列');
    this.appendDummyInput('column_dropdown')
      .appendField(new Blockly.FieldDropdown(getColumns), 'column_name');
    this.setOutput(true, VariableTypes.String);
    this.setColour(210);
    this.setInputsInline(true);

    this.setOnChange((event: Blockly.Events.Abstract) => {
      if (
        event.type === Blockly.Events.BLOCK_CHANGE &&
        event.element === 'field' &&
        event.name === 'df'
      ) {
        this.updateColumns();
      } else if (event.type === Blockly.Events.BLOCK_CREATE) {
        this.updateColumns();
      }
    });
  },

  updateColumns: async function (this: Blockly.Block) {
    const workspace = this.workspace as WithAdditionalWorkspace;
    const dfVariableName = this.getFieldValue('df');

    if (!workspace.data || !workspace.data.getDataFrameColumns || !dfVariableName) {
      return;
    }

    try {
      const columns = await workspace.data.getDataFrameColumns(dfVariableName, this.workspace);
      const options = columns.map((col) => [col, col]);
      if (options.length === 0) {
        options.push(['(列なし)', '']);
      }
      const dropdown = this.getField('column_name') as Blockly.FieldDropdown;
      dropdown.get = () => options;
      dropdown.setValue(options[0][1]);
    } catch (e) {
      console.error('Failed to update DataFrame columns:', e);
      const dropdown = this.getField('column_name') as Blockly.FieldDropdown;
      dropdown.get = () => [['(エラー)', '']];
      dropdown.setValue('');
    }
  },
};

pythonGenerator.forBlock[DATAFRAME_COLUMNS_DROPDOWN] = (block, generator) => {
  const selectedColumn = block.getFieldValue('column_name');
  const code = generator.quote_(selectedColumn);
  return [code, Order.ATOMIC];
};
