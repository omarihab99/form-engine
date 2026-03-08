import type { Adapter, FieldSchema } from '@omarihab/form-engine-core';
import type { GraphFI } from '@pnp/graph';
import '@pnp/graph/users';

export class SPPeoplePickerAdapter implements Adapter {
  readonly name = 'sp-people-picker';
  private graph: GraphFI | null = null;

  async initialize(context: { graph: GraphFI }): Promise<void> {
    this.graph = context.graph;
  }

  async fetchOptions(field: FieldSchema): Promise<{ label: string; value: string }[]> {
    return [];
  }

  async searchPeople(query: string): Promise<{ displayName: string; email: string; id: string }[]> {
    if (!this.graph || !query) return [];

    const users = await this.graph.users
      .filter(`startswith(displayName,'${query}') or startswith(mail,'${query}')`)
      .top(10)
      .select('displayName', 'mail', 'id')();

    return users.map((u) => ({
      displayName: u.displayName || '',
      email: u.mail || '',
      id: u.id || '',
    }));
  }

  destroy(): void {
    this.graph = null;
  }
}
