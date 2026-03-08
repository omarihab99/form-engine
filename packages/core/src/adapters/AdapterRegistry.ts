import type { Adapter, AdapterRegistryInterface } from '../types';

export class AdapterRegistry implements AdapterRegistryInterface {
  private adapters = new Map<string, Adapter>();

  register(adapter: Adapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  get(name: string): Adapter | undefined {
    return this.adapters.get(name);
  }

  getAll(): Adapter[] {
    return Array.from(this.adapters.values());
  }

  remove(name: string): void {
    const adapter = this.adapters.get(name);
    adapter?.destroy?.();
    this.adapters.delete(name);
  }

  destroyAll(): void {
    for (const adapter of this.adapters.values()) {
      adapter.destroy?.();
    }
    this.adapters.clear();
  }
}
