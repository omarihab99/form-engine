import { StateManager } from '../StateManager';

describe('StateManager', () => {
  let sm: StateManager;

  beforeEach(() => {
    sm = new StateManager({ name: '', age: 0 });
  });

  it('should initialize with default values', () => {
    const state = sm.getState();
    expect(state.values).toEqual({ name: '', age: 0 });
    expect(state.isDirty).toBe(false);
    expect(state.isValid).toBe(true);
    expect(state.isSubmitting).toBe(false);
  });

  it('should set and get a value', () => {
    sm.setValue('name', 'Alice');
    expect(sm.getValue('name')).toBe('Alice');
    expect(sm.getState().isDirty).toBe(true);
  });

  it('should not notify when setting same value', () => {
    const listener = jest.fn();
    sm.subscribe(listener);
    sm.setValue('name', '');
    expect(listener).not.toHaveBeenCalled();
  });

  it('should set multiple values', () => {
    sm.setValues({ name: 'Bob', age: 30 });
    expect(sm.getValue('name')).toBe('Bob');
    expect(sm.getValue('age')).toBe(30);
  });

  it('should track field dirty state', () => {
    sm.setValue('name', 'X');
    expect(sm.getFieldState('name')?.isDirty).toBe(true);
    expect(sm.getFieldState('age')?.isDirty).toBe(false);
  });

  it('should set field errors', () => {
    sm.setFieldErrors('name', ['Required']);
    expect(sm.getFieldState('name')?.errors).toEqual(['Required']);
    expect(sm.getState().isValid).toBe(false);
  });

  it('should clear errors and restore validity', () => {
    sm.setFieldErrors('name', ['Required']);
    sm.setFieldErrors('name', []);
    expect(sm.getState().isValid).toBe(true);
  });

  it('should set field touched', () => {
    sm.setFieldTouched('name', true);
    expect(sm.getFieldState('name')?.isTouched).toBe(true);
  });

  it('should set field visibility', () => {
    sm.setFieldVisibility('name', false);
    expect(sm.getFieldState('name')?.isVisible).toBe(false);
  });

  it('should set field disabled', () => {
    sm.setFieldDisabled('name', true);
    expect(sm.getFieldState('name')?.isDisabled).toBe(true);
  });

  it('should set field required', () => {
    sm.setFieldRequired('name', true);
    expect(sm.getFieldState('name')?.isRequired).toBe(true);
  });

  it('should track submitting state', () => {
    sm.setSubmitting(true);
    expect(sm.getState().isSubmitting).toBe(true);
    sm.setSubmitting(false);
    expect(sm.getState().isSubmitting).toBe(false);
  });

  it('should increment submit count', () => {
    sm.incrementSubmitCount();
    sm.incrementSubmitCount();
    expect(sm.getState().submitCount).toBe(2);
  });

  it('should reset to defaults', () => {
    sm.setValue('name', 'Changed');
    sm.setFieldErrors('name', ['err']);
    sm.reset({ name: '', age: 0 });
    expect(sm.getValue('name')).toBe('');
    expect(sm.getState().isDirty).toBe(false);
    expect(sm.getState().isValid).toBe(true);
  });

  it('should notify subscribers on state change', () => {
    const listener = jest.fn();
    sm.subscribe(listener);
    sm.setValue('name', 'Test');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe', () => {
    const listener = jest.fn();
    const unsub = sm.subscribe(listener);
    unsub();
    sm.setValue('name', 'Test');
    expect(listener).not.toHaveBeenCalled();
  });

  it('should initialize a new field', () => {
    sm.initializeField('email', '', true);
    expect(sm.getFieldState('email')?.isRequired).toBe(true);
    expect(sm.getValue('email')).toBe('');
  });
});
