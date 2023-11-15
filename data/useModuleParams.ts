import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { useConfig } from '@/composables';
import { useQuery } from '@tanstack/vue-query';

export const useModuleParams = (moduleName: MaybeRefOrGetter<string>) => {
  const { data: params, isLoading } = useQuery({
    queryKey: [{ scope: 'params', entity: `moduleParams` }, toValue(moduleName)],
    queryFn: async () => {
      const { transport } = useConfig();
      return await transport.getModuleParams(toValue(moduleName));
    },
  });

  return { params, isLoading };
};
