import * as Blockly from "blockly/core";
import { pythonGenerator, Order } from "blockly/python";
import { FieldVariableSklearnModel } from "../../variables";
import { BLOCKLY_VARIABLE_DATA_FRAME } from "../../variable_types";

export const SK_LEARN_PREDICT_AND_EVALUATE = "sklearn_predicate_and_evalute";

Blockly.Blocks[SK_LEARN_PREDICT_AND_EVALUATE] = {
  init: function () {
    this.appendDummyInput()
      .appendField("モデル")
      .appendField(new FieldVariableSklearnModel("model"), "model")
      .appendField("を");
    this.appendValueInput("X")
      .appendField("データ")
      .setCheck(BLOCKLY_VARIABLE_DATA_FRAME);
    this.appendValueInput("Y")
      .appendField("の目的変数で予測精度を評価")
      .setCheck("String");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip(
      "指定したモデルで、テストデータと目的変数を使って予測精度を評価します"
    );
  },
};

pythonGenerator.forBlock[SK_LEARN_PREDICT_AND_EVALUATE] = (
  block,
  generator
) => {
  const modelName = block.getField("model")?.getText() || "model";
  const xDf = generator.valueToCode(block, "X", Order.NONE) || "df";
  const yCol = generator.valueToCode(block, "Y", Order.NONE) || "'target'";

  (generator as any).definitions_["import_sklearn_metrics"] =
    "from sklearn.metrics import classification_report, confusion_matrix, mean_squared_error, r2_score";
  (generator as any).definitions_["import_numpy"] = "import numpy as np";
  (generator as any).definitions_["import_sklearn_base"] = "from sklearn.base import is_classifier";

  const code = `
X_test = ${xDf}.drop(columns=[${yCol}])
y_test = ${xDf}[${yCol}]
y_pred = ${modelName}.predict(X_test)

result = {}
if is_classifier(model):
    result["type"] = "classification"
    result["metrics"] = {
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
    }
else:
    result["type"] = "regression"
    result["metrics"] = {
        "mean_squared_error": mean_squared_error(y_test, y_pred),
        "r2_score": r2_score(y_test, y_pred)
    }

print(result)
`.trim();

  return code + "\n";
};
