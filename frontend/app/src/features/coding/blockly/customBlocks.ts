import * as Blockly from "blockly";
import { type UploadFile } from "../providers";

/**
 * Initializes the custom blocks for the Blockly workspace.
 * @param filesRef A React ref object containing the latest list of uploaded files.
 */
export const defineCustomBlocks = (filesRef: React.RefObject<UploadFile[]>) => {
  Blockly.Blocks["select_csv_file"] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown(() => {
          const currentFiles = filesRef.current || [];
          return currentFiles.length > 0
            ? currentFiles.map((file) => [file.name, file.name])
            : [["（ファイルなし）", ""]];
        }),
        "CSV_FILE"
      );
      this.setOutput(true, "String");
      this.setColour(210);
      this.setTooltip("選択したCSVファイルのファイル名を返します。");
    },
  };
};
