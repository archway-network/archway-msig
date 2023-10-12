export const useFeatures = () => {
  const runtimeConfig = useRuntimeConfig();

  return {
    VESTING_CONTRACTS: (runtimeConfig.public.app.features as any)?.VESTING_CONTRACTS ?? false,
  };
};
