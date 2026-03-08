import type { EventBusInterface, EventHandler, FormEvent, FormEventType } from '../types';

export class EventBus implements EventBusInterface {
  private listeners = new Map<FormEventType, Set<EventHandler>>();

  on(event: FormEventType, handler: EventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: FormEventType, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: FormEvent): void {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (err) {
          console.error(`[FormEngine] Error in event handler for "${event.type}":`, err);
        }
      }
    }
  }

  removeAllListeners(event?: FormEventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
