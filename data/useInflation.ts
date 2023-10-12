import { Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { NetworkParams } from '@/domain';

export const useInflation = async (): Promise<{
  inflation: Ref<number | undefined>;
  loading: Ref<boolean>;
}> => {
  const { data: inflation, isLoading } = useQuery({
    queryKey: [{ scope: 'chainParams', entity: 'inflation' }],
    queryFn: NetworkParams.inflation,
    staleTime: Infinity,
  });

  return {
    inflation,
    loading: isLoading,
  };
};
