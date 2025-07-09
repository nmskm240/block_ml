import { Order, pythonGenerator } from "blockly/python";

pythonGenerator.forBlock["select_csv_file"] = function (block, generator) {
  const fileName = block.getFieldValue("CSV_FILE");
  (generator as any).definitions_["import_pandas"] = "import pandas as pd";
  const code = `pd.read_csv('/home/pyodide/${fileName}')`;
  return [code, Order.ATOMIC];
};
