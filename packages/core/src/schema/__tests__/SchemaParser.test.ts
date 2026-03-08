import { SchemaParser } from '../SchemaParser';

describe('SchemaParser', () => {
  let parser: SchemaParser;

  beforeEach(() => {
    parser = new SchemaParser();
  });

  const validSchema = {
    id: 'test-form',
    title: 'Test Form',
    sections: [
      {
        id: 'section-1',
        fields: [
          { id: 'name', type: 'text', label: 'Name' },
          { id: 'email', type: 'text', label: 'Email' },
        ],
      },
    ],
  };

  describe('validate', () => {
    it('should return no errors for a valid schema', () => {
      expect(parser.validate(validSchema)).toEqual([]);
    });

    it('should reject non-object schema', () => {
      const errors = parser.validate(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('must be an object');
    });

    it('should require schema id', () => {
      const errors = parser.validate({ sections: [] });
      expect(errors.some((e) => e.path === 'id')).toBe(true);
    });

    it('should require sections array', () => {
      const errors = parser.validate({ id: 'test' });
      expect(errors.some((e) => e.path === 'sections')).toBe(true);
    });

    it('should require section id', () => {
      const errors = parser.validate({
        id: 'test',
        sections: [{ fields: [{ id: 'f', type: 'text', label: 'F' }] }],
      });
      expect(errors.some((e) => e.message.includes('Section must have'))).toBe(true);
    });

    it('should reject invalid field type', () => {
      const errors = parser.validate({
        id: 'test',
        sections: [{ id: 's1', fields: [{ id: 'f', type: 'invalid', label: 'F' }] }],
      });
      expect(errors.some((e) => e.message.includes('Invalid field type'))).toBe(true);
    });

    it('should detect duplicate field ids', () => {
      const errors = parser.validate({
        id: 'test',
        sections: [
          {
            id: 's1',
            fields: [
              { id: 'dup', type: 'text', label: 'F1' },
              { id: 'dup', type: 'text', label: 'F2' },
            ],
          },
        ],
      });
      expect(errors.some((e) => e.message.includes('Duplicate'))).toBe(true);
    });

    it('should require options for dropdown fields', () => {
      const errors = parser.validate({
        id: 'test',
        sections: [{ id: 's1', fields: [{ id: 'f', type: 'dropdown', label: 'F' }] }],
      });
      expect(errors.some((e) => e.message.includes('requires an "options" array'))).toBe(true);
    });
  });

  describe('parse', () => {
    it('should return normalized schema', () => {
      const result = parser.parse(validSchema);
      expect(result.locale).toBe('en');
      expect(result.sections[0].columns).toBe(1);
      expect(result.sections[0].fields[0].colSpan).toBe(1);
      expect(result.sections[0].fields[0].required).toBe(false);
    });

    it('should throw on invalid schema', () => {
      expect(() => parser.parse({})).toThrow('Invalid form schema');
    });
  });
});
