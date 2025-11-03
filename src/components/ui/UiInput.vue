<template>
  <div class="ui-input">
    <label v-if="label" :for="id" class="ui-input__label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      class="ui-input__field"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="$emit('enter')"
      @blur="$emit('blur')"
      :placeholder="placeholder"
    />
    <p v-if="error" class="ui-input__error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UiInput',
  props: {
    id: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'enter', 'blur'],
}
</script>

<style scoped>
.ui-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.ui-input__label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.ui-input__field {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.ui-input__field:focus {
  outline: none;
  border-color: #007bff;
}

.ui-input__error {
  color: #d33;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
