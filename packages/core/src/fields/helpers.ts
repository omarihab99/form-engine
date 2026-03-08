import type { FieldRendererContext } from '../rendering/FieldRegistry';

const INPUT_CLASSES =
  'fe-w-full fe-px-3 fe-py-2 fe-border fe-border-gray-300 fe-rounded-md fe-text-sm ' +
  'fe-bg-white fe-transition-colors fe-outline-none ' +
  'focus:fe-border-primary-500 focus:fe-ring-1 focus:fe-ring-primary-500 ' +
  'disabled:fe-bg-gray-100 disabled:fe-cursor-not-allowed ' +
  'rtl:fe-text-right';

const ERROR_INPUT_CLASSES =
  'fe-border-error-500 focus:fe-border-error-500 focus:fe-ring-error-500';

export function getInputClasses(ctx: FieldRendererContext): string {
  return ctx.errors.length > 0 ? `${INPUT_CLASSES} ${ERROR_INPUT_CLASSES}` : INPUT_CLASSES;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  children?: (Node | string)[],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
  }
  if (children) {
    for (const child of children) {
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
  }
  return el;
}
