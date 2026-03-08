export interface SPFormEngineContext {
  spHttpClient: unknown;
  graphClient: unknown;
  siteUrl: string;
  currentUser: {
    loginName: string;
    displayName: string;
    email: string;
  };
  pageContext: {
    web: { absoluteUrl: string; serverRelativeUrl: string };
    site: { absoluteUrl: string; id: string };
    list?: { id: string; title: string };
    listItem?: { id: number };
  };
}

export function createSPContext(wpContext: {
  spHttpClient: unknown;
  graphHttpClient?: unknown;
  msGraphClientFactory?: unknown;
  pageContext: {
    web: { absoluteUrl: string; serverRelativeUrl: string };
    site: { absoluteUrl: string; id: { toString: () => string } };
    list?: { id: { toString: () => string }; title: string };
    listItem?: { id: number };
    user: { loginName: string; displayName: string; email: string };
  };
}): SPFormEngineContext {
  return {
    spHttpClient: wpContext.spHttpClient,
    graphClient: wpContext.graphHttpClient || wpContext.msGraphClientFactory,
    siteUrl: wpContext.pageContext.web.absoluteUrl,
    currentUser: {
      loginName: wpContext.pageContext.user.loginName,
      displayName: wpContext.pageContext.user.displayName,
      email: wpContext.pageContext.user.email,
    },
    pageContext: {
      web: wpContext.pageContext.web,
      site: {
        absoluteUrl: wpContext.pageContext.site.absoluteUrl,
        id: wpContext.pageContext.site.id.toString(),
      },
      list: wpContext.pageContext.list
        ? {
            id: wpContext.pageContext.list.id.toString(),
            title: wpContext.pageContext.list.title,
          }
        : undefined,
      listItem: wpContext.pageContext.listItem,
    },
  };
}
