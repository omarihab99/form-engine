import { EventBus } from '../EventBus';
import type { FormEvent } from '../../types';

describe('EventBus', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should call handlers on emit', () => {
    const handler = jest.fn();
    bus.on('change', handler);

    const event: FormEvent = { type: 'change', fieldId: 'name', value: 'test', timestamp: Date.now() };
    bus.emit(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should support multiple handlers for same event', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();
    bus.on('change', h1);
    bus.on('change', h2);

    bus.emit({ type: 'change', timestamp: Date.now() });

    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers for different events', () => {
    const handler = jest.fn();
    bus.on('submit', handler);

    bus.emit({ type: 'change', timestamp: Date.now() });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should unsubscribe with returned function', () => {
    const handler = jest.fn();
    const unsub = bus.on('change', handler);

    unsub();
    bus.emit({ type: 'change', timestamp: Date.now() });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should unsubscribe with off()', () => {
    const handler = jest.fn();
    bus.on('change', handler);
    bus.off('change', handler);

    bus.emit({ type: 'change', timestamp: Date.now() });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove all listeners for a specific event', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();
    bus.on('change', h1);
    bus.on('submit', h2);

    bus.removeAllListeners('change');
    bus.emit({ type: 'change', timestamp: Date.now() });
    bus.emit({ type: 'submit', timestamp: Date.now() });

    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it('should remove all listeners when no event specified', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();
    bus.on('change', h1);
    bus.on('submit', h2);

    bus.removeAllListeners();
    bus.emit({ type: 'change', timestamp: Date.now() });
    bus.emit({ type: 'submit', timestamp: Date.now() });

    expect(h1).not.toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  it('should catch errors in handlers without stopping other handlers', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const h1 = jest.fn(() => { throw new Error('oops'); });
    const h2 = jest.fn();
    bus.on('change', h1);
    bus.on('change', h2);

    bus.emit({ type: 'change', timestamp: Date.now() });

    expect(h2).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
