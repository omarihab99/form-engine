import type { Adapter } from '@omarihab/form-engine-core';
import type { GraphFI } from '@pnp/graph';

export class SPGraphSubmitAdapter implements Adapter {
  readonly name = 'sp-graph-submit';
  private graph: GraphFI | null = null;
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async initialize(context: { graph: GraphFI }): Promise<void> {
    this.graph = context.graph;
  }

  async onSubmit(values: Record<string, unknown>): Promise<unknown> {
    if (!this.graph) throw new Error('SPGraphSubmitAdapter not initialized');

    const result = await (
      this.graph as unknown as { api: (url: string) => { post: (body: unknown) => Promise<unknown> } }
    )
      .api(this.endpoint)
      .post({ body: JSON.stringify(values) });

    return result;
  }

  destroy(): void {
    this.graph = null;
  }
}
