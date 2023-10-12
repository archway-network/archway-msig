import { useConfig } from '@/composables';

export default class NetworkParams {
  static async inflation(): Promise<number> {
    const { restEndpoint } = useConfig();

    return $fetch<any>(`${restEndpoint}/cosmos/mint/v1beta1/inflation`).then(data => {
      return Number(data?.inflation || 0);
    });
  }
}
