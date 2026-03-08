import { spfi, SPBrowser } from '@pnp/sp';
import { graphfi, SPFx as GraphSPFx } from '@pnp/graph';
import type { SPFI } from '@pnp/sp';
import type { GraphFI } from '@pnp/graph';

export interface PnPInstances {
  sp: SPFI;
  graph: GraphFI;
}

export function initializePnP(context: {
  pageContext: { web: { absoluteUrl: string } };
  [key: string]: unknown;
}): PnPInstances {
  const sp = spfi().using(SPBrowser({ baseUrl: context.pageContext.web.absoluteUrl }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graph = graphfi().using(GraphSPFx(context as any));

  return { sp, graph };
}
