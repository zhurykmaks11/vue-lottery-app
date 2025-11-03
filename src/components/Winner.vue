<template>
  <span class="badge bg-primary me-2 d-inline-flex align-items-center">
    {{ participant.name }}
    <button class="btn btn-sm btn-light ms-2 p-0" @click="$emit('remove', participant.id)">
      ×
    </button>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Participant } from '../types.ts'
export default defineComponent({
  name: 'AppWinner',
  props: { participant: { type: Object as () => Participant, required: true } },
  emits: ['remove'],
})
</script>
