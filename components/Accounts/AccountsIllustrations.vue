<script lang="jsx" setup>
  import Illustration1 from '@/components/Accounts/Illustrations/Illustration1.vue';
  import Illustration2 from '@/components/Accounts/Illustrations/Illustration2.vue';
  import Illustration3 from '@/components/Accounts/Illustrations/Illustration3.vue';
  import Illustration4 from '@/components/Accounts/Illustrations/Illustration4.vue';
  import Illustration5 from '@/components/Accounts/Illustrations/Illustration5.vue';
  import Illustration6 from '@/components/Accounts/Illustrations/Illustration6.vue';
  import Illustration7 from '@/components/Accounts/Illustrations/Illustration7.vue';
  import Illustration8 from '@/components/Accounts/Illustrations/Illustration8.vue';

  defineProps({
    accountIndex: { type: Number, required: true },
  });

  const illustrations = [
    Illustration1,
    Illustration2,
    Illustration3,
    Illustration4,
    Illustration5,
    Illustration6,
    Illustration7,
    Illustration8,
  ];
</script>

<template>
  <component :is="illustrations[accountIndex % 8]" />
</template>
