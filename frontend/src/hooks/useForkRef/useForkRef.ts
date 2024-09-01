import React from 'react';

import { setRef } from '@/utils/ref';

export default function useForkRef<Instance>(
  refA: React.Ref<Instance> | null | undefined,
  refB: React.Ref<Instance> | null | undefined
) {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    return (refValue: Instance | null) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
