import type { Adapter } from '@omarihab/form-engine-core';
import type { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/files';
import '@pnp/sp/folders';

export class SPFileUploadAdapter implements Adapter {
  readonly name = 'sp-file-upload';
  private sp: SPFI | null = null;
  private libraryPath: string;

  constructor(libraryPath: string) {
    this.libraryPath = libraryPath;
  }

  async initialize(context: { sp: SPFI }): Promise<void> {
    this.sp = context.sp;
  }

  async uploadFile(
    file: File,
    folderPath?: string,
  ): Promise<{ name: string; url: string }> {
    if (!this.sp) throw new Error('SPFileUploadAdapter not initialized');

    const targetFolder = folderPath || this.libraryPath;
    const buffer = await file.arrayBuffer();

    const result = await this.sp.web
      .getFolderByServerRelativePath(targetFolder)
      .files.addUsingPath(file.name, buffer, { Overwrite: true });

    return {
      name: file.name,
      url: (result as unknown as { ServerRelativeUrl?: string }).ServerRelativeUrl || '',
    };
  }

  async onSubmit(values: Record<string, unknown>): Promise<unknown> {
    const uploadResults: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(values)) {
      if (typeof File !== 'undefined' && value instanceof File) {
        uploadResults[key] = await this.uploadFile(value);
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof File !== 'undefined' &&
        value[0] instanceof File
      ) {
        uploadResults[key] = await Promise.all(
          (value as File[]).map((f) => this.uploadFile(f)),
        );
      }
    }

    return uploadResults;
  }

  destroy(): void {
    this.sp = null;
  }
}
