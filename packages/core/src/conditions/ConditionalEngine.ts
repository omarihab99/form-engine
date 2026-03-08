import type { ComparisonOperator, ConditionRule } from '../types';

export class ConditionalEngine {
  evaluateConditions(
    conditions: ConditionRule[],
    values: Record<string, unknown>,
  ): { visible: boolean; disabled: boolean; required: boolean } {
    let visible = true;
    let disabled = false;
    let required = false;

    for (const condition of conditions) {
      const result = this.evaluateCondition(condition, values);

      switch (condition.action) {
        case 'show':
          if (!result) visible = false;
          break;
        case 'hide':
          if (result) visible = false;
          break;
        case 'require':
          if (result) required = true;
          break;
        case 'disable':
          if (result) disabled = true;
          break;
        case 'enable':
          if (!result) disabled = true;
          break;
      }
    }

    return { visible, disabled, required };
  }

  evaluateCondition(condition: ConditionRule, values: Record<string, unknown>): boolean {
    const { operator, expressions } = condition;

    if (operator === 'or') {
      return expressions.some((expr) =>
        this.evaluateExpression(expr.operator, values[expr.field], expr.value),
      );
    }

    // default is 'and'
    return expressions.every((expr) =>
      this.evaluateExpression(expr.operator, values[expr.field], expr.value),
    );
  }

  evaluateExpression(operator: ComparisonOperator, fieldValue: unknown, targetValue: unknown): boolean {
    switch (operator) {
      case 'eq':
        return fieldValue === targetValue;
      case 'neq':
        return fieldValue !== targetValue;
      case 'gt':
        return Number(fieldValue) > Number(targetValue);
      case 'lt':
        return Number(fieldValue) < Number(targetValue);
      case 'gte':
        return Number(fieldValue) >= Number(targetValue);
      case 'lte':
        return Number(fieldValue) <= Number(targetValue);
      case 'contains':
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(String(targetValue));
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(targetValue);
        }
        return false;
      case 'in':
        if (Array.isArray(targetValue)) {
          return targetValue.includes(fieldValue);
        }
        return false;
      case 'empty':
        return (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === '' ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
      case 'notEmpty':
        return (
          fieldValue !== undefined &&
          fieldValue !== null &&
          fieldValue !== '' &&
          !(Array.isArray(fieldValue) && fieldValue.length === 0)
        );
      default:
        return false;
    }
  }
}
