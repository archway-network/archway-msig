<script lang="ts" setup>
  import TextInput from '@/components/Ui/Forms/DefaultTextInput.vue';
  import SearchIcon from '@/components/Ui/Icons/SearchIcon.vue';

  defineProps({ modelValue: { type: String, default: '' } });
  defineEmits(['update:modelValue']);
</script>

<template>
  <TextInput
    :modelValue="modelValue"
    @update:modelValue="newValue => $emit('update:modelValue', newValue)"
    placeholder="Search"
    :icon="SearchIcon"
  />
</template>
