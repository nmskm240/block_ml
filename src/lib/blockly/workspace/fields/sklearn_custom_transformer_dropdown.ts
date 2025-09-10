import * as Blockly from 'blockly/core';

import { SKLEARN_CUSTOM_TRANSFORMER_DEF } from '../blocks';

export class SklearnCustomTransformerDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([['変換器なし', 'NONE']]);
  }

  override init(): void {
    super.init();
    this.setOptions(() => {
      const workspace = this.sourceBlock_?.workspace;
      const blocks =
        workspace?.getBlocksByType(SKLEARN_CUSTOM_TRANSFORMER_DEF) ?? [];
      return blocks.length > 0
        ? blocks.map<Blockly.MenuOption>((block) => {
            const name = block.getFieldValue('NAME');
            return [name, name];
          })
        : [['変換器なし', 'NONE']];
    });
  }
}

Blockly.fieldRegistry.register(
  'sklearn_custom_transformer_dd',
  SklearnCustomTransformerDropdown,
);
