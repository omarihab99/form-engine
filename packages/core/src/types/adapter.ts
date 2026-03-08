import type { FieldSchema } from './schema';

export interface Adapter {
  readonly name: string;
  initialize?(context: unknown): Promise<void>;
  fetchOptions?(field: FieldSchema): Promise<{ label: string; value: string | number }[]>;
  resolveValue?(field: FieldSchema, value: unknown): Promise<unknown>;
  onSubmit?(values: Record<string, unknown>): Promise<unknown>;
  renderField?(field: FieldSchema, container: HTMLElement): HTMLElement | null;
  destroy?(): void;
}

export interface AdapterRegistryInterface {
  register(adapter: Adapter): void;
  get(name: string): Adapter | undefined;
  getAll(): Adapter[];
  remove(name: string): void;
}
