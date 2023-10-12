<script lang="ts" setup>
  defineProps({
    modelValue: { type: Boolean, default: false },
    id: { type: String, required: true },
    label: { type: String },
    description: { type: String },
  });

  defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-5 items-center">
      <input
        :checked="modelValue"
        @input="event => $emit('update:modelValue', Boolean((event.target as HTMLInputElement).checked))"
        :id="id"
        :name="id"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-orange focus:ring-0"
      />
    </div>
    <div class="ml-3 text-sm">
      <label :for="id" class="font-medium">
        <slot></slot>
        {{ label }}
      </label>
      <p v-if="description" :id="`${id}-description`" class="text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>
