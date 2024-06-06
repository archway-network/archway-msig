<script lang="ts" setup>
  import { computed, type PropType } from 'vue';
  import { type RouteLocationRaw } from 'vue-router';
  import ExternalLinkIcon from '@/components/Ui/Icons/ExternalLinkIcon.vue';
  import LoadingIcon from '@/components/Ui/Icons/LoadingIcon.vue';

  const props = defineProps({
    href: { type: String as PropType<string | RouteLocationRaw>, default: undefined },
    loading: { type: Boolean, default: false },
    hideExternalIcon: { type: Boolean, default: false },
    simpleExternalIcon: { type: Boolean, default: false },
  });

  const isLink = computed<boolean>(() => !!props.href);
  const isExternal = computed<boolean>(() => /^(http|https):\/\//.test(props.href as string));
</script>

<template>
  <NuxtLink
    :href="href"
    :external="isExternal"
    :target="isExternal ? '_blank' : ''"
    :class="['text-orange hover:text-orange/80 hover:no-underline', 'inline-flex items-center gap-[0.25em]']"
    v-if="isLink"
  >
    <span>
      <slot />
    </span>
    <ExternalLinkIcon class="w-4 h-4" v-if="isExternal && !hideExternalIcon && !simpleExternalIcon" />
    <div v-if="isExternal && !hideExternalIcon && simpleExternalIcon">↗</div>
  </NuxtLink>
  <button class="text-orange hover:text-orange/80 hover:no-underline focus:outline-none" v-else>
    <span class="flex-1 flex justify-center items-center" v-if="loading">
      <LoadingIcon class="w-5 h-5 text-white animate-spin" />
    </span>
    <slot v-else></slot>
  </button>
</template>
