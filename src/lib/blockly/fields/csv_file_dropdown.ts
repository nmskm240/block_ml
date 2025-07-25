import * as Blockly from "blockly/core";

export class CsvFileDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([["（ファイルなし）", "__NO_FILE__"]]);
  }

  public override init(): void {
    super.init();
    this.setOptions(() => {
      const workspace = this.sourceBlock_?.workspace;
      const filesRef: File[] = (workspace as any)?.fileRef || [];
      return filesRef.length > 0
        ? filesRef.map<[string, string]>((f) => [f.name, f.name])
        : [["（ファイルなし）", "__NO_FILE__"]];
    });
  }
}

Blockly.fieldRegistry.register("csv_field_type", CsvFileDropdown);
