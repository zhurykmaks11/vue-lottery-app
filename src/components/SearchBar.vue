<template>
  <div class="card mb-3">
    <div class="card-body d-flex gap-2 align-items-center">
      <input v-model="q" class="form-control" placeholder="Пошук за іменем..." @input="onInput" />
      <button class="btn btn-outline-secondary" @click="clear">Скинути</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SearchBar',
  emits: ['filter-by-name'],
  data() {
    return { q: '' }
  },
  methods: {
    onInput() {
      this.$emit('filter-by-name', this.q.trim())
    },
    clear() {
      this.q = ''
      this.$emit('filter-by-name', '')
    },
  },
})
</script>
