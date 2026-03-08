import type { Adapter, FieldSchema } from '@omarihab/form-engine-core';
import type { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

export class SPListAdapter implements Adapter {
  readonly name = 'sp-list';
  private sp: SPFI | null = null;
  private listId: string;

  constructor(listId: string) {
    this.listId = listId;
  }

  async initialize(context: { sp: SPFI }): Promise<void> {
    this.sp = context.sp;
  }

  async fetchOptions(field: FieldSchema): Promise<{ label: string; value: string | number }[]> {
    if (!this.sp || !field.lookupListId) return [];

    const items = await this.sp.web.lists
      .getById(field.lookupListId)
      .items.select('Id', field.lookupField || 'Title')
      .top(500)();

    return items.map((item: Record<string, unknown>) => ({
      label: String(item[field.lookupField || 'Title']),
      value: item.Id as number,
    }));
  }

  async onSubmit(values: Record<string, unknown>): Promise<unknown> {
    if (!this.sp) throw new Error('SPListAdapter not initialized');

    const result = await this.sp.web.lists
      .getById(this.listId)
      .items.add(values);

    return result;
  }

  destroy(): void {
    this.sp = null;
  }
}
