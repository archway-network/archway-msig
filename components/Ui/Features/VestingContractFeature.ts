import { defineComponent } from 'vue';
import { useFeatures } from '@/composables';
import { render } from '@/utils';

export const VestingContractFeature = defineComponent({
  name: 'VestingContractFeature',

  setup(props, { slots, attrs, emit }) {
    const features = useFeatures();
    const propsWeControl = { as: 'template' };

    return () => {
      if (!features.VESTING_CONTRACTS) return undefined;
      return render({ name: 'VestingContractFeature', props: { ...props, ...propsWeControl }, slots, attrs });
    };
  },
});
