import type { Adapter } from '@omarihab/form-engine-core';

export class SPWebhookSubmitAdapter implements Adapter {
  readonly name = 'sp-webhook-submit';
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async onSubmit(values: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  destroy(): void {}
}
