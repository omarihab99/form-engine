import { useSyncExternalStore, useCallback } from 'react';
import { useFormEngineContext } from '../context';

export interface UseFieldArrayReturn {
  items: unknown[];
  append: (item?: Record<string, unknown>) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  replace: (index: number, item: Record<string, unknown>) => void;
}

export function useFieldArray(sectionId: string): UseFieldArrayReturn {
  const { engine } = useFormEngineContext();
  const stateManager = engine.getStateManager();

  const items = useSyncExternalStore(
    useCallback((cb) => stateManager.subscribe(cb), [stateManager]),
    () => (stateManager.getValue(sectionId) as unknown[]) || [],
    () => (stateManager.getValue(sectionId) as unknown[]) || [],
  );

  return {
    items,
    append: (item = {}) => {
      engine.setValue(sectionId, [...items, item]);
    },
    remove: (index: number) => {
      engine.setValue(sectionId, items.filter((_, i) => i !== index));
    },
    move: (from: number, to: number) => {
      const newItems = [...items];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(to, 0, moved);
      engine.setValue(sectionId, newItems);
    },
    replace: (index: number, item: Record<string, unknown>) => {
      const newItems = [...items];
      newItems[index] = item;
      engine.setValue(sectionId, newItems);
    },
  };
}
