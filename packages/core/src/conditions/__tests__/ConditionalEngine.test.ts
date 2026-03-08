import { ConditionalEngine } from '../ConditionalEngine';
import type { ConditionRule } from '../../types';

describe('ConditionalEngine', () => {
  let engine: ConditionalEngine;

  beforeEach(() => {
    engine = new ConditionalEngine();
  });

  describe('evaluateExpression', () => {
    it('eq', () => {
      expect(engine.evaluateExpression('eq', 'hello', 'hello')).toBe(true);
      expect(engine.evaluateExpression('eq', 'hello', 'world')).toBe(false);
    });

    it('neq', () => {
      expect(engine.evaluateExpression('neq', 'a', 'b')).toBe(true);
      expect(engine.evaluateExpression('neq', 'a', 'a')).toBe(false);
    });

    it('gt / lt / gte / lte', () => {
      expect(engine.evaluateExpression('gt', 5, 3)).toBe(true);
      expect(engine.evaluateExpression('gt', 3, 5)).toBe(false);
      expect(engine.evaluateExpression('lt', 3, 5)).toBe(true);
      expect(engine.evaluateExpression('gte', 5, 5)).toBe(true);
      expect(engine.evaluateExpression('lte', 5, 5)).toBe(true);
    });

    it('contains (string)', () => {
      expect(engine.evaluateExpression('contains', 'hello world', 'world')).toBe(true);
      expect(engine.evaluateExpression('contains', 'hello', 'world')).toBe(false);
    });

    it('contains (array)', () => {
      expect(engine.evaluateExpression('contains', ['a', 'b'], 'a')).toBe(true);
      expect(engine.evaluateExpression('contains', ['a', 'b'], 'c')).toBe(false);
    });

    it('in', () => {
      expect(engine.evaluateExpression('in', 'a', ['a', 'b', 'c'])).toBe(true);
      expect(engine.evaluateExpression('in', 'd', ['a', 'b', 'c'])).toBe(false);
    });

    it('empty', () => {
      expect(engine.evaluateExpression('empty', '', undefined)).toBe(true);
      expect(engine.evaluateExpression('empty', null, undefined)).toBe(true);
      expect(engine.evaluateExpression('empty', undefined, undefined)).toBe(true);
      expect(engine.evaluateExpression('empty', [], undefined)).toBe(true);
      expect(engine.evaluateExpression('empty', 'x', undefined)).toBe(false);
    });

    it('notEmpty', () => {
      expect(engine.evaluateExpression('notEmpty', 'hello', undefined)).toBe(true);
      expect(engine.evaluateExpression('notEmpty', '', undefined)).toBe(false);
    });
  });

  describe('evaluateCondition', () => {
    it('should evaluate AND conditions', () => {
      const condition: ConditionRule = {
        action: 'show',
        operator: 'and',
        expressions: [
          { field: 'type', operator: 'eq', value: 'other' },
          { field: 'age', operator: 'gt', value: 18 },
        ],
      };
      expect(engine.evaluateCondition(condition, { type: 'other', age: 20 })).toBe(true);
      expect(engine.evaluateCondition(condition, { type: 'other', age: 15 })).toBe(false);
    });

    it('should evaluate OR conditions', () => {
      const condition: ConditionRule = {
        action: 'show',
        operator: 'or',
        expressions: [
          { field: 'role', operator: 'eq', value: 'admin' },
          { field: 'role', operator: 'eq', value: 'manager' },
        ],
      };
      expect(engine.evaluateCondition(condition, { role: 'admin' })).toBe(true);
      expect(engine.evaluateCondition(condition, { role: 'manager' })).toBe(true);
      expect(engine.evaluateCondition(condition, { role: 'user' })).toBe(false);
    });
  });

  describe('evaluateConditions', () => {
    it('should handle show action', () => {
      const conditions: ConditionRule[] = [
        {
          action: 'show',
          operator: 'and',
          expressions: [{ field: 'type', operator: 'eq', value: 'other' }],
        },
      ];
      expect(engine.evaluateConditions(conditions, { type: 'other' }).visible).toBe(true);
      expect(engine.evaluateConditions(conditions, { type: 'none' }).visible).toBe(false);
    });

    it('should handle hide action', () => {
      const conditions: ConditionRule[] = [
        {
          action: 'hide',
          operator: 'and',
          expressions: [{ field: 'hidden', operator: 'eq', value: true }],
        },
      ];
      expect(engine.evaluateConditions(conditions, { hidden: true }).visible).toBe(false);
      expect(engine.evaluateConditions(conditions, { hidden: false }).visible).toBe(true);
    });

    it('should handle require action', () => {
      const conditions: ConditionRule[] = [
        {
          action: 'require',
          operator: 'and',
          expressions: [{ field: 'type', operator: 'eq', value: 'other' }],
        },
      ];
      expect(engine.evaluateConditions(conditions, { type: 'other' }).required).toBe(true);
      expect(engine.evaluateConditions(conditions, { type: 'none' }).required).toBe(false);
    });

    it('should handle disable action', () => {
      const conditions: ConditionRule[] = [
        {
          action: 'disable',
          operator: 'and',
          expressions: [{ field: 'locked', operator: 'eq', value: true }],
        },
      ];
      expect(engine.evaluateConditions(conditions, { locked: true }).disabled).toBe(true);
    });

    it('should handle enable action (inverse disable)', () => {
      const conditions: ConditionRule[] = [
        {
          action: 'enable',
          operator: 'and',
          expressions: [{ field: 'active', operator: 'eq', value: true }],
        },
      ];
      expect(engine.evaluateConditions(conditions, { active: true }).disabled).toBe(false);
      expect(engine.evaluateConditions(conditions, { active: false }).disabled).toBe(true);
    });
  });
});
