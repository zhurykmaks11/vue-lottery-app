<template>
  <button
    class="ui-button"
    :class="['ui-button--' + variant, { 'ui-button--disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UiButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
})
</script>

<style scoped>
.ui-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
  border: none;
}

.ui-button--primary {
  background-color: #007bff;
  color: white;
}

.ui-button--secondary {
  background-color: #6c757d;
  color: white;
}

.ui-button--danger {
  background-color: #dc3545;
  color: white;
}

.ui-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
