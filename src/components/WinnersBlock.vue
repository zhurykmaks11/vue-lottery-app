<template>
  <div class="card mb-6">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <span v-if="winners.length === 0" class="text-muted">Переможці поки що відсутні</span>
        <div v-else>
          <Winner
            v-for="w in winners"
            :key="w.id"
            :participant="w"
            @remove="$emit('remove-winner', $event)"
          />
        </div>
      </div>

      <div>
        <button class="btn btn-success" :disabled="isDisabled" @click="$emit('new-winner')">
          Новий переможець
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Winner from './Winner.vue'
import type { Participant } from '../types'

export default defineComponent({
  name: 'WinnersBlock',
  components: { Winner },
  props: {
    winners: { type: Array as () => Participant[],
      required: true
    },
    participantsCount: {
      type: Number,
      required: true },
  },
  emits: ['remove-winner', 'new-winner'],
  setup(props) {
    const isDisabled = computed(() =>
      props.winners.length >= 3 || props.participantsCount === 0)
    return { isDisabled }
  },
})
</script>
