import { useQuery } from '@tanstack/vue-query';

import { Validators, Validator } from '@/domain';

import { ValidatorsFilterTypes } from '@/types';

export const useValidatorsActive = async (
  enabled: ComputedRef<boolean> = computed(() => true)
): Promise<{
  validators: ComputedRef<Validator[] | undefined>;
  nextPageToken: ComputedRef<string | undefined>;
  loading: ComputedRef<boolean>;
}> => {
  const { data: activeValidatorsData, isLoading } = useQuery({
    queryKey: [{ scope: 'validators', entity: 'index', filter: ValidatorsFilterTypes.ACTIVE }],
    queryFn: Validators.all,
    enabled: enabled,
  });

  return {
    validators: computed(() => activeValidatorsData.value?.validators),
    nextPageToken: computed(() => activeValidatorsData.value?.nextPageToken),
    loading: computed(() => enabled.value && isLoading.value),
  };
};
