import { Validator } from '../Validator';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  describe('required', () => {
    it('should fail for empty string', async () => {
      const errors = await validator.validateField('f', '', [{ type: 'required' }], {});
      expect(errors).toHaveLength(1);
    });

    it('should fail for null/undefined', async () => {
      const e1 = await validator.validateField('f', null, [{ type: 'required' }], {});
      const e2 = await validator.validateField('f', undefined, [{ type: 'required' }], {});
      expect(e1).toHaveLength(1);
      expect(e2).toHaveLength(1);
    });

    it('should fail for empty array', async () => {
      const errors = await validator.validateField('f', [], [{ type: 'required' }], {});
      expect(errors).toHaveLength(1);
    });

    it('should pass for non-empty value', async () => {
      const errors = await validator.validateField('f', 'hello', [{ type: 'required' }], {});
      expect(errors).toHaveLength(0);
    });
  });

  describe('minLength / maxLength', () => {
    it('should fail below minLength', async () => {
      const errors = await validator.validateField('f', 'ab', [{ type: 'minLength', value: 3 }], {});
      expect(errors).toHaveLength(1);
    });

    it('should fail above maxLength', async () => {
      const errors = await validator.validateField('f', 'abcdef', [{ type: 'maxLength', value: 5 }], {});
      expect(errors).toHaveLength(1);
    });

    it('should pass within bounds', async () => {
      const errors = await validator.validateField(
        'f', 'abc',
        [{ type: 'minLength', value: 2 }, { type: 'maxLength', value: 5 }],
        {},
      );
      expect(errors).toHaveLength(0);
    });
  });

  describe('min / max', () => {
    it('should fail below min', async () => {
      const errors = await validator.validateField('f', 3, [{ type: 'min', value: 5 }], {});
      expect(errors).toHaveLength(1);
    });

    it('should fail above max', async () => {
      const errors = await validator.validateField('f', 10, [{ type: 'max', value: 5 }], {});
      expect(errors).toHaveLength(1);
    });
  });

  describe('regex / pattern', () => {
    it('should fail non-matching regex', async () => {
      const errors = await validator.validateField('f', 'abc', [{ type: 'regex', value: '^\\d+$' }], {});
      expect(errors).toHaveLength(1);
    });

    it('should pass matching regex', async () => {
      const errors = await validator.validateField('f', '123', [{ type: 'regex', value: '^\\d+$' }], {});
      expect(errors).toHaveLength(0);
    });
  });

  describe('email', () => {
    it('should fail invalid email', async () => {
      const errors = await validator.validateField('f', 'not-email', [{ type: 'email' }], {});
      expect(errors).toHaveLength(1);
    });

    it('should pass valid email', async () => {
      const errors = await validator.validateField('f', 'a@b.com', [{ type: 'email' }], {});
      expect(errors).toHaveLength(0);
    });
  });

  describe('url', () => {
    it('should fail invalid url', async () => {
      const errors = await validator.validateField('f', 'not-a-url', [{ type: 'url' }], {});
      expect(errors).toHaveLength(1);
    });

    it('should pass valid url', async () => {
      const errors = await validator.validateField('f', 'https://example.com', [{ type: 'url' }], {});
      expect(errors).toHaveLength(0);
    });
  });

  describe('custom validators', () => {
    it('should use inline validate function', async () => {
      const errors = await validator.validateField(
        'f', 'bad',
        [{ type: 'custom', validate: (v) => v === 'good' || 'Must be good' }],
        {},
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Must be good');
    });

    it('should use registered custom validator', async () => {
      validator.registerValidator('even', (v) => (v as number) % 2 === 0 || 'Must be even');
      const errors = await validator.validateField('f', 3, [{ type: 'even' }], {});
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Must be even');
    });

    it('should use custom message when provided', async () => {
      const errors = await validator.validateField(
        'f', '',
        [{ type: 'required', message: 'Please fill this in' }],
        {},
      );
      expect(errors[0].message).toBe('Please fill this in');
    });
  });

  describe('validateAll', () => {
    it('should validate all fields', async () => {
      const rules = new Map([
        ['name', [{ type: 'required' }]],
        ['email', [{ type: 'required' }, { type: 'email' }]],
      ]);
      const result = await validator.validateAll({ name: '', email: 'bad' }, rules);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2); // name required + email invalid
    });

    it('should return valid for correct values', async () => {
      const rules = new Map([
        ['name', [{ type: 'required' }]],
      ]);
      const result = await validator.validateAll({ name: 'Alice' }, rules);
      expect(result.valid).toBe(true);
    });
  });
});
