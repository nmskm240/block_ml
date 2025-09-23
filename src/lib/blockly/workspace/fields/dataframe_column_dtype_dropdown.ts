import * as Blockly from 'blockly/core';

import { DataframeColumnDtype } from '../types';

export class DataframeColumnDtypeDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['整数', DataframeColumnDtype.Int],
      ['浮動小数', DataframeColumnDtype.Float],
      ['真偽値', DataframeColumnDtype.Bool],
      ['文字列', DataframeColumnDtype.Object],
    ]);
  }
}

Blockly.fieldRegistry.register('dataframe_column_dtype_dropdown', DataframeColumnDtypeDropdown);
