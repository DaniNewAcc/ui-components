/**
 * Custom hook to generate a stable set of unique IDs for compound parts of a UI component.
 *
 * Useful for accessibility attributes like `aria-labelledby`, `aria-describedby`, etc.
 *
 * @param baseName - Prefix for the component (e.g., 'modal')
 * @param parts - Array of compound part keys (e.g., ['title', 'description'])
 * @param overrides - Optional map of part names to custom IDs
 * @returns Map of part names to generated or overridden IDs
 */

import { useId } from 'react';

type CompoundParts = string[];
type CompoundIdMap = Record<string, string>;

const useComponentIds = (
  baseName: string,
  parts: CompoundParts,
  overrides?: Partial<CompoundIdMap>
): CompoundIdMap => {
  const baseId = useId();

  return parts.reduce<CompoundIdMap>((acc, part) => {
    acc[part] = overrides?.[part] ?? `${baseName}-${baseId}-${part}`;
    return acc;
  }, {});
};

export default useComponentIds;
