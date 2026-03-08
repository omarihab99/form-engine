export type ConditionOperator = 'and' | 'or';

export type ComparisonOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'contains'
  | 'in'
  | 'empty'
  | 'notEmpty';

export type ConditionAction = 'show' | 'hide' | 'require' | 'disable' | 'enable';

export interface ConditionExpression {
  field: string;
  operator: ComparisonOperator;
  value?: unknown;
}

export interface ConditionRule {
  action: ConditionAction;
  operator: ConditionOperator;
  expressions: ConditionExpression[];
}
