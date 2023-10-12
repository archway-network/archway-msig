<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { LoadingPulse, Tokens } from '@/components/Ui';
  import { TokenAmount } from '@/domain';

  defineProps({
    amount: { type: Object as PropType<TokenAmount> },
    isLoading: { type: Boolean, default: false },
  });

  const attr = useAttrs();
</script>

<template>
  <Tokens class="max-w-full" :wrapped-with-span="false">
    <LoadingPulse class="w-32 h-8" v-if="isLoading" />
    <!-- Using "floating-vue" library because our own tooltip implementation
         (with tailwind classes) breaks when overflow-x-hidden is set -->
    <VTooltip class="title-5 text-ellipsis overflow-x-hidden" placement="bottom" v-bind="attr" v-else>
      <span>{{ amount?.format() }}</span>
      <template #popper>
        <div class="caption">{{ amount?.format() }}</div>
      </template>
    </VTooltip>
  </Tokens>
</template>
