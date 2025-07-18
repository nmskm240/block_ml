import * as Blockly from "blockly/core";
import { BLOCKLY_VARIABLE_DATA_FRAME } from "../variable_types";

export class FieldVariableDataFrame extends Blockly.FieldVariable {
  constructor(varname?: string) {
    super(varname || "df", undefined, [BLOCKLY_VARIABLE_DATA_FRAME], BLOCKLY_VARIABLE_DATA_FRAME);
  }

  override initModel() {
    super.initModel();
    const workspace = this.sourceBlock_?.workspace;
    const name = this.getText();

    // 変数が存在しなければ作成
    if (workspace && !(workspace.getVariableMap().getVariable(name)?.getType() === BLOCKLY_VARIABLE_DATA_FRAME)) {
      workspace.getVariableMap().createVariable(name, BLOCKLY_VARIABLE_DATA_FRAME);
    }
  }
}

Blockly.fieldRegistry.register("field_variable_dataframe", FieldVariableDataFrame);