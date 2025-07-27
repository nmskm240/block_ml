export const VariableTypes = {
  String: 'String',
  Number: 'Number',
  Boolean: 'Boolean',
  Array: 'Array',
  Dataframe: 'Dataframe',
  Model: 'Model',
} as const;

export type VariableTypes = (typeof VariableTypes)[keyof typeof VariableTypes];
