<template>
  <div class="d-flex justify-content-between align-items-center w-100">
    <div class="d-flex flex-wrap align-items-center gap-2">
      <span v-if="winners.length === 0" class="text-muted">Winners</span>

      <div
        v-for="w in winners"
        :key="w.id"
        class="badge text-white d-flex align-items-center p-2"
        style="background-color: #2196f3; font-weight: normal; font-size: 1em;"
      >
        <span class="me-2">{{ w.name }}</span>
        <button
          class="btn btn-sm p-0 ms-1"
          style="line-height: 1; color: white; opacity: 0.7; background: transparent; border: none;"
          @click="$emit('remove-winner', w.id)"
          title="Remove winner"
        >
          &times;
        </button>
      </div>

      <span v-if="winners.length > 0" class="text-muted ms-1">Winners</span>

    </div>

    <button
      class="btn btn-info text-white"
      :disabled="isNewDisabled"
      @click="$emit('new-winner')"
    >
      New winner
    </button>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { Participant } from '../types'

export default defineComponent({
  name: 'WinnersBlock',
  props: {
    winners: {
      type: Array as () => Participant[],
      required: true
    },
    participantsCount: {
      type: Number,
      required: true
    }
  },
  emits: ['remove-winner', 'new-winner'],
  setup(props) {
    const isNewDisabled = computed(() => {
      return props.winners.length >= 3 || props.participantsCount === 0
    })

    return { isNewDisabled }
  }
})
</script>

<style scoped>
.badge button {
  background: transparent;
  border: none;
  font-size: 1.05rem;
  color: #333;
  cursor: pointer;
}
.badge button:hover { color: #000; }
</style>
