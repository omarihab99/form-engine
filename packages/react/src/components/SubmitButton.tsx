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
        'fe-px-5 fe-py-2 fe-bg-gray-700 fe-text-white fe-rounded-sm fe-text-sm fe-font-normal ' +
          'hover:fe-bg-gray-800 focus:fe-outline-none focus:fe-ring-1 focus:fe-ring-gray-500 ' +
          'disabled:fe-opacity-50 disabled:fe-cursor-not-allowed fe-transition-colors'
      }
    >
      {isSubmitting
        ? i18n.t('form.submitting')
        : children || i18n.t('form.submit')}
    </button>
  );
}
