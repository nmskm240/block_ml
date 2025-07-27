import * as Blockly from 'blockly/core';

export class CsvFileDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([['（ファイルなし）', '__NO_FILE__']]);
  }

  public override init(): void {
    super.init();
    this.setOptions(() => {
      const workspace = this.sourceBlock_?.workspace;
      const fileNames: string[] = (workspace as any)?.fileNames ?? [];
      return fileNames.length > 0
        ? fileNames.map<[string, string]>((f) => [f, f])
        : [['（ファイルなし）', '__NO_FILE__']];
    });
  }
}

Blockly.fieldRegistry.register('csv_field_type', CsvFileDropdown);
