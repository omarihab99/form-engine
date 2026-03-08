import type { Adapter, FieldSchema } from '@omarihab/form-engine-core';
import type { GraphFI } from '@pnp/graph';

export class SPTaxonomyAdapter implements Adapter {
  readonly name = 'sp-taxonomy';
  private graph: GraphFI | null = null;
  private siteId: string;

  constructor(siteId: string) {
    this.siteId = siteId;
  }

  async initialize(context: { graph: GraphFI }): Promise<void> {
    this.graph = context.graph;
  }

  async fetchOptions(field: FieldSchema): Promise<{ label: string; value: string }[]> {
    if (!this.graph || !field.taxonomyTermSetId) return [];

    try {
      const response: { value: { labels: { name: string }[]; id: string }[] } =
        await (this.graph as unknown as { api: (url: string) => { get: () => Promise<unknown> } })
          .api(
            `/sites/${this.siteId}/termStore/sets/${field.taxonomyTermSetId}/terms?$select=id,labels`,
          )
          .get() as { value: { labels: { name: string }[]; id: string }[] };

      return (response.value || []).map(
        (term: { labels: { name: string }[]; id: string }) => ({
          label: term.labels?.[0]?.name || term.id,
          value: term.id,
        }),
      );
    } catch {
      return [];
    }
  }

  destroy(): void {
    this.graph = null;
  }
}
