import { Ref, ref } from 'vue';
import { computed, ComputedRef } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { NavigationLabels } from '@/domain/Navigation';

export const useNavigation: () => {
  expanded: ComputedRef<boolean>;
  toggle: () => void;
  setCurrentNavigation: (currentNavLabel: string) => void;
  currentNavigation: Ref<string>;
} = () => {
  const isNavigationExpanded = useLocalStorage('NAVIGATION_EXPANDED', true, { writeDefaults: true });

  const currentNavigation = ref<string>(NavigationLabels.Accounts);

  const toggle = () => {
    isNavigationExpanded.value = !isNavigationExpanded.value;
  };

  const setCurrentNavigation = (currentNavLabel: string) => {
    currentNavigation.value = currentNavLabel;
  };

  return {
    expanded: computed(() => !!isNavigationExpanded.value),
    toggle,
    setCurrentNavigation,
    currentNavigation,
  };
};
