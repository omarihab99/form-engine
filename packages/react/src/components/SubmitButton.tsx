import React from 'react';
import { useFormEngine } from '../hooks/useFormEngine';
import { useFormEngineContext } from '../context';

export interface SubmitButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { engine } = useFormEngineContext();
  const { isSubmitting, submit } = useFormEngine();
  const i18n = engine.getI18n();

  return (
    <button
      type="button"
      onClick={() => submit()}
      disabled={isSubmitting}
      className={
        className ||
        'fe-px-6 fe-py-2 fe-bg-primary-600 fe-text-white fe-rounded-md fe-text-sm fe-font-medium ' +
          'hover:fe-bg-primary-700 focus:fe-outline-none focus:fe-ring-2 focus:fe-ring-primary-500 focus:fe-ring-offset-2 ' +
          'disabled:fe-opacity-50 disabled:fe-cursor-not-allowed fe-transition-colors'
      }
    >
      {isSubmitting
        ? i18n.t('form.submitting')
        : children || i18n.t('form.submit')}
    </button>
  );
}
