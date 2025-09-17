export enum VariableTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Array = 'Array',
  Dataframe = 'Dataframe',
  Model = 'Model',
  Transformer = 'Transformer',
  Pipeline = 'Pipeline',
}

export enum SklearnClassificationModelType {
  TreeClassifier = 'tree_classifier',
  LogisticRegression = 'logistic_Regrression',
}

export enum SklearnRegressionModelType {
  LinearRegression = 'linear_regression',
  SVR = 'svr',
}

export enum SklearnScalerType {
  StandardScaler = 'standard_scaler',
  MinMaxScaler = 'min_max_scaler',
}

export enum SklearnEncoderType {
  OneHotEncoder = 'one_hot_encoder',
  LabelEncoder = 'label_encoder',
}

export enum SklearnNormalizerType {
  L1 = 'l1',
  L2 = 'l2',
}

export enum SklearnDiscretizerType {
  Binarizer = 'binarizer',
  KBinsDiscretizer = 'kbins_discretizer',
}

export enum SklearnClassificationMetricType {
  Accuracy = 'accuracy_score',
  Precision = 'precision_score',
  Recall = 'recall_score',
  F1 = 'f1_score',
}

export enum SklearnRegressionMetricType {
  MeanSquaredError = 'mean_squared_error',
  R2Score = 'r2_score',
}

export enum SklearnDatasets {
  Diabetes = 'diabetes',
  Iris = 'iris',
  Linnerud = 'linnerud',
  Wine = 'wine',
}

export enum PlotlyGraphType {
  Bar = 'bar',
  Box = 'box',
  Histogram = 'histogram',
  Line = 'line',
  Scatter = 'scatter',
}

export enum PlotlyGraphHistfuncType {
  Count = 'count',
  Sum = 'sum',
  Avg = 'avg',
  Min = 'min',
  Max = 'max',
}
