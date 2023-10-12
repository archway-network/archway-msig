<script lang="ts" setup>
  const props = defineProps({ modelValue: { type: Number, default: 1 }, total: { type: Number, default: 0 } });
  defineEmits(['update:modelValue']);

  const buttons = computed(() => {
    if (props.total <= 1) {
      return [];
    }

    let result: number[] = [];
    // Add numbers surrounding selected value
    for (let i = Math.max(1, props.modelValue - 1); i <= Math.min(props.total, props.modelValue + 1); i++) {
      result.push(i);
    }

    // Add numbers at start, 0 will be converted to '...' later
    if (result[0] !== 1) {
      if (result[0] > 3) {
        // If selected is last, add another number at start
        result = (props.modelValue === result[result.length - 1] ? [1, 2, 0] : [1, 0]).concat(result);
      } else {
        for (let i = result[0] - 1; i >= 1; i--) {
          result.unshift(i);
        }
      }
    }

    // Add numbers at end, 0 will be converted to '...' later
    const lastNum = result[result.length - 1];
    if (lastNum !== props.total) {
      if (lastNum < props.total - 2) {
        // If selected is 1, add another number at end
        result = result.concat(props.modelValue === 1 ? [0, props.total - 1, props.total] : [0, props.total]);
      } else {
        for (let i = lastNum + 1; i <= props.total; i++) {
          result.push(i);
        }
      }
    }

    // Format with 2 digits, replace 0 with ...
    const formatter = Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 2,
    });
    return result.map((item, index) => {
      if (item) {
        return {
          value: item,
          formatted: formatter.format(item),
        };
      }

      return {
        // Make the three points go to a intermediate page
        value: Math.ceil((result[index - 1] + result[index + 1]) / 2),
        formatted: '...',
      };
    });
  });
</script>

<template>
  <div v-if="buttons.length" class="flex flex-grow-0 flex-row items-center justify-center h-16 p-2 bg-white rounded-lg">
    <div @click="$emit('update:modelValue', Math.max(1, modelValue - 1))" class="caption p-4 cursor-pointer text-black">&lt;</div>
    <div
      v-for="item of buttons"
      @click="$emit('update:modelValue', item.value)"
      :class="['caption p-4 cursor-pointer text-gray-800', { 'text-orange drop-shadow-button': item.value === modelValue }]"
    >
      {{ item.formatted }}
    </div>
    <div @click="$emit('update:modelValue', Math.min(total, modelValue + 1))" class="caption p-4 cursor-pointer text-black">&gt;</div>
  </div>
</template>
