import * as Blockly from "blockly/core";

export class FieldVariableSeries extends Blockly.FieldVariable {
  constructor(varname?: string) {
    super(varname || "series", undefined, ["Series"], "Series");
  }
}

Blockly.fieldRegistry.register("field_variable_series", FieldVariableSeries);
