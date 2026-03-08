import { FormEngine } from '@omarihab/form-engine-core';
import type { FormEngineOptions, FormSchema, Adapter } from '@omarihab/form-engine-core';
import { createSPContext } from '../context/SPFormEngineContext';
import type { SPFormEngineContext } from '../context/SPFormEngineContext';

export abstract class FormEngineAppCustomizerBase {
  protected engine: FormEngine | null = null;
  protected spContext: SPFormEngineContext | null = null;
  private container: HTMLElement | null = null;

  protected abstract getSchema(): FormSchema | Record<string, unknown>;
  protected abstract getAdapters(): Adapter[];
  protected abstract getPlaceholderElement(): HTMLElement | null;

  protected onInit(appContext: {
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
  }): void {
    this.spContext = createSPContext(appContext);
  }

  protected render(options?: Partial<FormEngineOptions>): void {
    this.container = this.getPlaceholderElement();
    if (!this.container) return;

    const schema = this.getSchema();
    const engineOptions: FormEngineOptions = {
      schema,
      ...options,
    };

    this.engine = new FormEngine(engineOptions);

    const adapters = this.getAdapters();
    for (const adapter of adapters) {
      this.engine.registerAdapter(adapter);
    }

    this.engine.mount(this.container);
  }

  protected onDispose(): void {
    this.engine?.destroy();
    this.engine = null;
    this.container = null;
  }
}
