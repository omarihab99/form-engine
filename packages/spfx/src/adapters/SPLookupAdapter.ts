import type { Adapter, FieldSchema } from '@omarihab/form-engine-core';
import type { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

export class SPLookupAdapter implements Adapter {
  readonly name = 'sp-lookup';
  private sp: SPFI | null = null;

  async initialize(context: { sp: SPFI }): Promise<void> {
    this.sp = context.sp;
  }

  async fetchOptions(field: FieldSchema): Promise<{ label: string; value: number }[]> {
    if (!this.sp || !field.lookupListId) return [];

    const displayField = field.lookupField || 'Title';
    const items = await this.sp.web.lists
      .getById(field.lookupListId)
      .items.select('Id', displayField)
      .top(500)();

    return items.map((item: Record<string, unknown>) => ({
      label: String(item[displayField]),
      value: item.Id as number,
    }));
  }

  async resolveValue(field: FieldSchema, value: unknown): Promise<unknown> {
    if (!this.sp || !field.lookupListId || !value) return null;

    const displayField = field.lookupField || 'Title';
    const item = await this.sp.web.lists
      .getById(field.lookupListId)
      .items.getById(Number(value))
      .select('Id', displayField)();

    return { id: item.Id, label: item[displayField] };
  }

  destroy(): void {
    this.sp = null;
  }
}
