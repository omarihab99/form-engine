export type FormEventType =
  | 'change'
  | 'submit'
  | 'submitSuccess'
  | 'submitError'
  | 'validate'
  | 'validationError'
  | 'mount'
  | 'unmount'
  | 'destroy'
  | 'reset'
  | 'fieldFocus'
  | 'fieldBlur'
  | 'sectionAdd'
  | 'sectionRemove'
  | 'stateChange';

export interface FormEvent {
  type: FormEventType;
  fieldId?: string;
  sectionId?: string;
  value?: unknown;
  previousValue?: unknown;
  errors?: { fieldId: string; message: string }[];
  timestamp: number;
}

export type EventHandler = (event: FormEvent) => void;

export interface EventBusInterface {
  on(event: FormEventType, handler: EventHandler): () => void;
  off(event: FormEventType, handler: EventHandler): void;
  emit(event: FormEvent): void;
  removeAllListeners(event?: FormEventType): void;
}
