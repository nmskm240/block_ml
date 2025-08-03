import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';
import { VariableTypes } from '../../types/variables';

export const SK_LEARN_PREDICT_AND_EVALUATE = 'sklearn_predicate_and_evalute';

Blockly.Blocks[SK_LEARN_PREDICT_AND_EVALUATE] = {
  init: function () {
    this.appendDummyInput()
      .appendField('モデル')
      .appendField(new Blockly.FieldVariable('model'), 'model')
      .appendField('を');
    this.appendDummyInput()
      .appendField('データ')
      .appendField(new Blockly.FieldVariable('X'), 'X');
    this.appendValueInput('Y')
      .appendField('の目的変数で予測精度を評価')
      .setCheck(VariableTypes.String);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip(
      '指定したモデルで、テストデータと目的変数を使って予測精度を評価します'
    );
  },
};

pythonGenerator.forBlock[SK_LEARN_PREDICT_AND_EVALUATE] = (
  block,
  generator
) => {
  const modelName = block.getField('model')?.getText() || 'model';
  const xDf = block.getField('X')?.getText() || 'df';
  const yCol = generator.valueToCode(block, 'Y', Order.NONE) || 'target';

  (generator as any).definitions_['import_sklearn_metrics'] =
    'from sklearn.metrics import classification_report, confusion_matrix, mean_squared_error, r2_score';
  (generator as any).definitions_['import_numpy'] = 'import numpy as np';
  (generator as any).definitions_['import_sklearn_base'] =
    'from sklearn.base import is_classifier';
  (generator as any).definitions_['import_json'] = 'import json';

  const code = `
_target_col_name = ${yCol}
X_test = ${xDf}.drop(columns=[_target_col_name]).copy()
y_test = ${xDf}[_target_col_name].copy()
y_pred = ${modelName}.predict(X_test)

if is_classifier(${modelName}):
  # Classification metrics
  report = classification_report(y_test, y_pred, output_dict=True)
  cm = confusion_matrix(y_test, y_pred)
  # Classification Report (Table)
  report_data = {
      "columns": ["", "precision", "recall", "f1-score", "support"],
      "rows": []
  }
  for label, metrics in report.items():
    if isinstance(metrics, dict):
      report_data["rows"].append([label, metrics["precision"], metrics["recall"], metrics["f1-score"], metrics["support"]])
    else:
      report_data["rows"].append([label, "", "", metrics, ""])
  __show_table_json("Classification Report", json.dumps(report_data))
  # Confusion Matrix (Heatmap)
  labels = [str(x) for x in np.unique(np.concatenate((y_test, y_pred)))]
  cm_data = {
      "data": [
          {
              "z": cm.tolist(),
              "x": labels,
              "y": labels,
              "type": "heatmap",
              "colorscale": "Viridis"
          }
      ],
      "layout": {
          "title": "Confusion Matrix",
          "xaxis": {"title": "Predicted"},
          "yaxis": {"title": "True"},
          "annotations": [
              {
                  "x": labels[j],
                  "y": labels[i],
                  "text": str(cm[i, j]),
                  "showarrow": False,
                  "font": {"color": "white" if cm[i, j] > cm.max() / 2 else "black"}
              } for i in range(cm.shape[0]) for j in range(cm.shape[1])
          ]
      }
  }
  __show_plot_json("Confusion Matrix", json.dumps(cm_data))

else:
  # Regression metrics
  mse = mean_squared_error(y_test, y_pred)
  r2 = r2_score(y_test, y_pred)
  # Regression Results (Table)
  regression_data = {
      "columns": ["Metric", "Value"],
      "rows": [
          ["Mean Squared Error", mse],
          ["R2 Score", r2]
      ]
  }
  __show_table_json("Regression Metrics", json.dumps(regression_data))
  # Actual vs Predicted Plot (Scatter)
  scatter_data = {
      "data": [
          {
              "x": y_test.tolist(),
              "y": y_pred.tolist(),
              "mode": "markers",
              "type": "scatter",
              "name": "Actual vs Predicted"
          }
      ],
      "layout": {
          "title": "Actual vs Predicted Values",
          "xaxis": {"title": "Actual Values"},
          "yaxis": {"title": "Predicted Values"}
      }
  }
  __show_plot_json("Actual vs Predicted", json.dumps(scatter_data))
`.trim();

  return code + '\n';
};
