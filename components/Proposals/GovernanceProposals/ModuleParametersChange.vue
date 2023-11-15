<script setup lang="ts">
  import { watch } from 'vue';
  import { omit } from 'lodash';
  import { TooltipPosition } from '@/types';
  import ErrorMessage from '@/components/Ui/Forms/ErrorMessage.vue';
  import { ModuleUpdate, MsgUpdateParamsMapper, UpdatableModule } from '@/types/params';
  import { TextareaInput, TooltipWithIcon } from '@/components/Ui';
  import { Link } from '@/components/Ui';
  import isPlainObject from 'lodash/isPlainObject';
  import { useModuleParams } from '@/data/useModuleParams';
  import { transformKeys, mergeObjects, normalizeParams } from '@/utils';

  const props = defineProps<{
    modelValue?: ModuleUpdate['params'];
    moduleName: UpdatableModule;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value?: ModuleUpdate['params']): void;
  }>();

  const moduleUpdateConfig = computed(() => (props.moduleName ? MsgUpdateParamsMapper[props.moduleName] : null));

  const rawParams = ref<string>();

  const { params: currentParamsRes, isLoading: isFetchingCurrentParams } = useModuleParams(() => props.moduleName);

  // Convert params keys from snake_case to camelCase
  // to make params object compatible with the SDK's messages' constructors
  const currentParams = computed(() => {
    if (currentParamsRes.value) {
      // cast to camelCase
      const camelCaseParams = transformKeys(currentParamsRes.value, v => {
        return v.replace(/_(.)/g, (_, ch) => ch.toUpperCase());
      });
      // replace 'seconds' shorthands with constructor-compatible input object
      return normalizeParams(camelCaseParams);
    }
    return undefined;
  });

  // Once received current params, init input (if not set already)
  const initRawParams = () => {
    if (!rawParams.value) {
      resetRawParams();
    }
  };
  const resetRawParams = () => {
    if (currentParams.value) {
      rawParams.value = JSON.stringify(currentParams.value, null, 2);
    }
  };

  watch(currentParams, initRawParams, { immediate: true });

  // Reset input on module change
  watch(() => props.moduleName, resetRawParams);

  const parsedParams = computed(() => {
    if (rawParams.value && moduleUpdateConfig.value) {
      let parsedParams: Record<string, any> | undefined;
      try {
        parsedParams = JSON.parse(rawParams.value);
        if (isPlainObject(parsedParams)) {
          // Use current params as defaults
          const merged = mergeObjects(parsedParams ?? {}, currentParams.value);

          // Check if compatible with the message constructor
          // emit undefined if unable to construct message from that input
          const { preview } = moduleUpdateConfig.value;
          preview({ authority: '', params: merged });

          return merged;
        }
      } catch {}
    }
    return undefined;
  });

  // Emit model once processed
  watch(parsedParams, newParsedParams => {
    emit('update:modelValue', newParsedParams);
  });

  // Parse to module-specific parameters
  const invalid = computed(() => !!rawParams.value && !parsedParams.value);

  const parametersPreview = computed(() => {
    if (!moduleUpdateConfig.value) return undefined;

    const { preview } = moduleUpdateConfig.value;
    try {
      const message = preview({ authority: '', params: parsedParams.value ?? currentParams.value });
      const params = message?.params ?? message;
      return omit(params, ['authority']);
    } catch {
      return undefined;
    }
  });
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="space-y-3">
      <TextareaInput v-model="rawParams" class="text-xs font-mono" :disabled="!moduleName || isFetchingCurrentParams">
        <template #label>
          <span class="flex gap-3">
            <span>
              Parameters (JSON)
              <Link
                v-if="moduleUpdateConfig?.docs"
                class="pl-1"
                :href="`https://docs.cosmos.network/main/build/modules/${moduleName}#parameters`"
              >
                Learn more
              </Link>
            </span>
            <span class="items-center h-0 ml-auto mr-px">
              <button
                @click="resetRawParams()"
                class="rounded px-2 py-0.5 text-gray-600 bg-gray-300/50 text-xs opacity-50 hover:opacity-75 duration-300"
                title="Apply current parameters"
              >
                reset
              </button>
            </span>
          </span>
        </template>
      </TextareaInput>
      <ErrorMessage v-if="invalid" :errors="`Invalid parameters for x/${moduleName} module.`" />
    </div>
    <div class="flex flex-col">
      <p class="label pb-3">
        <span>Preview</span>
        <TooltipWithIcon
          class="text-gray inline-flex relative -top-1 h-0"
          :text="`These parameters, based on your input, will be applied onchain to the x/${moduleName} module if the proposal is accepted.`"
          width="220px"
          :position="TooltipPosition.TOP"
        />
      </p>
      <div
        class="[--bg:231_229_228] flex-1 rounded-lg overflow-hidden bg-[rgb(var(--bg))] text-gray-600 relative after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,_rgb(var(--bg)),_rgb(var(--bg)_/_0)_1rem,_rgb(var(--bg)_/_0)_calc(100%-1rem),_rgb(var(--bg)))] after:pointer-events-none after:z-10"
      >
        <div class="max-h-[24rem] overflow-auto p-4">
          <template v-if="!isFetchingCurrentParams">
            <pre v-if="parametersPreview" class="text-xs h-full min-h-full">{{ JSON.stringify(parametersPreview, null, 2) }}</pre>
            <p v-else class="text-gray/50 text-sm">Specify parameters first</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
