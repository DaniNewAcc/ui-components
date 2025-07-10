/**
 * Custom hook to implement typeahead functionality for selectable options.
 *
 * It listens for sequential key inputs within a specified timeout period,
 * concatenates the keys typed so far, and searches for the first enabled option
 * whose label starts with the typed sequence (case-insensitive).
 * When a match is found, it calls the provided `onMatch` callback with the matched option's value.
 *
 * @template T - The type of option objects, extending TypeaheadOption (which can be disabled).
 * @param {Object} params - The hook parameters.
 * @param {T[]} params.options - The list of selectable options.
 * @param {(item: T) => string} params.getLabel - Function to extract the label text from an option.
 * @param {(item: T) => string | number} params.getValue - Function to extract the value from an option.
 * @param {(matchedValue: string | number) => void} params.onMatch - Callback triggered when a matching option is found.
 * @param {number} [params.timeout=500] - Duration in milliseconds to reset the typed keys sequence.
 *
 * @returns {Object} An object containing `handleTypeahead` function to be called with each typed key.
 */

import { useCallback, useRef } from 'react';

export type TypeaheadOption = {
  disabled?: boolean;
  [key: string]: any;
};

type UseTypeaheadProps<T extends TypeaheadOption> = {
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  onMatch: (matchedValue: string | number) => void;
  timeout?: number;
};

function useTypeahead<T extends TypeaheadOption>({
  options,
  getLabel,
  getValue,
  onMatch,
  timeout = 500,
}: UseTypeaheadProps<T>) {
  const typedKeysRef = useRef<string>('');
  const timeoutRef = useRef<number | null>(null);

  const handleTypeahead = useCallback(
    (key: string) => {
      typedKeysRef.current += key.toLowerCase();

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        typedKeysRef.current = '';
      }, timeout);

      const search = typedKeysRef.current;

      const match = options.find(
        item => !item.disabled && getLabel(item)?.toLowerCase().startsWith(search)
      );

      if (match) {
        onMatch(getValue(match));
      }
    },
    [options, getLabel, getValue, onMatch, timeout]
  );

  return { handleTypeahead };
}

export default useTypeahead;
