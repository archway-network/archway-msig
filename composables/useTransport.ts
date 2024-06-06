import { type ITransport } from '@/types';
import { useConfig } from './useConfig';

/**
 * Use specific transport if provided, or default app-level transport as fallback
 * @param transport Specific transfer to use instead of default one
 * @returns transport
 */
export const useTransport = (transport?: ITransport) => {
  const { transport: defaultTransport } = useConfig();
  return transport ?? defaultTransport;
};
