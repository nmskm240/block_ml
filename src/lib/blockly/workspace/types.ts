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

export enum SklearnModelType {
  TreeClassifier = 'tree_classifier',
  LogisticRegression = 'logistic_Regrression',
}

export enum SklearnTransformerType {
  StandardScaler = 'standard_scaler',
  MinMaxScaler = 'min_max_scaler',
}

export enum SklearnDatasets {
  Iris = 'iris',
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
