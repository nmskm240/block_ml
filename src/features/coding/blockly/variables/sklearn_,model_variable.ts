import * as Blockly from "blockly/core";

export class FieldVariableSklearnModel extends Blockly.FieldVariable {
  constructor(varname?: string) {
    super(varname || "model", undefined, ["SklearnModel"], "SklearnModel");
  }
}

Blockly.fieldRegistry.register(
  "field_variable_sklearn_model",
  FieldVariableSklearnModel
);
