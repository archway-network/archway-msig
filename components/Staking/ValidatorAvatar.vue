<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  const props = defineProps({
    avatar: { type: String, default: '' },
    name: { type: String, required: true },
  });

  const attr = useAttrs();

  const initial = computed(() => props.name.charAt(0));

  // On error, set class 'hidden', which will make an alternative logo visible (with the initial of the name)
  const handleErrorAvatar = (e: any) => e.target.classList.add('hidden');
</script>

<template>
  <img
    v-bind="attr"
    class="peer rounded-full w-11 h-11 grayscale"
    :class="[{ hidden: !avatar }]"
    :src="avatar"
    :alt="name"
    @error="handleErrorAvatar"
  />
  <div v-bind="attr" class="hidden peer-[.hidden]:flex w-11 h-11 items-center justify-center rounded-full bg-black text-white uppercase">
    {{ initial }}
  </div>
</template>
