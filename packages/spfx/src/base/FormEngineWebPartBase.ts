import { FormEngine } from '@omarihab/form-engine-core';
import type { FormEngineOptions, FormSchema, Adapter } from '@omarihab/form-engine-core';
import { createSPContext } from '../context/SPFormEngineContext';
import type { SPFormEngineContext } from '../context/SPFormEngineContext';

export interface FormEngineWebPartProperties {
  schema: string | FormSchema;
  locale?: string;
}

export abstract class FormEngineWebPartBase {
  protected engine: FormEngine | null = null;
  protected spContext: SPFormEngineContext | null = null;
  private domElement: HTMLElement | null = null;

  protected abstract getSchema(): FormSchema | Record<string, unknown>;
  protected abstract getAdapters(): Adapter[];

  protected onInit(wpContext: {
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
    this.spContext = createSPContext(wpContext);
  }

  protected render(domElement: HTMLElement, options?: Partial<FormEngineOptions>): void {
    this.domElement = domElement;

    const schema = this.getSchema();
    const engineOptions: FormEngineOptions = {
      schema,
      ...options,
    };

    this.engine = new FormEngine(engineOptions);

    // Register adapters
    const adapters = this.getAdapters();
    for (const adapter of adapters) {
      this.engine.registerAdapter(adapter);
    }

    // Mount
    this.engine.mount(domElement);
  }

  protected onDispose(): void {
    this.engine?.destroy();
    this.engine = null;
    this.domElement = null;
  }

  protected getFormEngine(): FormEngine | null {
    return this.engine;
  }
}
