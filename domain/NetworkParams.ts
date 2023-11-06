import { useConfig } from '@/composables';

export default class NetworkParams {
  static async inflation(): Promise<number> {
    const { transport } = useConfig();
    return await transport.getInflation();
  }
}
