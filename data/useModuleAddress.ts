import { useConfig } from '@/composables';
import { useQuery } from '@tanstack/vue-query';

export const useModuleAddress = (moduleName: string) => {
  const { data: address } = useQuery({
    queryKey: [{ scope: 'accounts', entity: `moduleAccount`, module: moduleName }],
    queryFn: async () => {
      const { transport } = useConfig();
      const res = await transport.getModuleAccount(moduleName);
      return res.account?.base_account.address;
    },
  });

  return { address };
};
