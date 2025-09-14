import * as Blockly from 'blockly/core';

export class FillMissingStrategyDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['平均値', 'mean'],
      ['中央値', 'median'],
      ['最頻値', 'most_frequent'],
    ]);
  }
}

Blockly.fieldRegistry.register(
  'fill_missing_strategy_dd',
  FillMissingStrategyDropdown,
);
