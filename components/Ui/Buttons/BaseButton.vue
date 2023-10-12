<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    href: { type: [String], default: null },
    loading: { type: [Boolean], default: false },
    isSecondary: { type: Boolean, default: false },
    hideExternalIcon: { type: Boolean, default: false },
    loadingClass: { type: String, default: '' },
  });

  const attr = useAttrs();

  const isLink = computed<boolean>(() => !!props.href);
  const isButton = computed<boolean>(() => !isLink.value);
  const isExternal = computed<boolean>(() => /^(http|https):\/\//.test(props.href));
  const isInternalRoute = computed(() => isLink.value && !isExternal.value);
  const className = [
    'h-12 px-6 inline-flex items-center justify-center whitespace-nowrap rounded-lg',
    'text-base leading-none hover:no-underline',
  ];
</script>

<template>
  <button :class="className" v-bind="attr" v-if="isButton">
    <span class="flex-1 flex justify-center items-center" v-if="loading">
      <svg class="w-5 h-5 text-gray animate-spin" :class="loadingClass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
    <slot v-else></slot>
  </button>
  <template v-else>
    <NuxtLink :to="href" :class="className" v-bind="attr" v-if="isInternalRoute">
      <slot />
    </NuxtLink>
    <a
      :href="href"
      :class="[...className, { 'external-link': isExternal && !hideExternalIcon }]"
      v-bind="attr"
      target="_blank"
      rel="'noopener noreferrer'"
      v-else
    >
      <span>
        <slot></slot>
      </span>
    </a>
  </template>
</template>
