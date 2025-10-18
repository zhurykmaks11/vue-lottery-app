<template>
  <div class="container py-4">
    <div class="card mb-4">
      <div class="card-body p-3">
        <WinnersBlock
          :winners="winners"
          @remove-winner="removeWinner"
          @new-winner="selectNewWinner"
          :participantsCount="participants.length"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <RegistrationForm @saved="addParticipant" />
      <div class=mt-4>
        <ParticipantsTable :participants="participants" @delete="deleteParticipant" />
      </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import WinnersBlock from './components/WinnersBlock.vue'
import type { Participant } from './types'

const STORAGE_KEY = 'vue_lottery_participants_v1'
const WINNERS_KEY = 'vue_lottery_winners_v1'

export default defineComponent({
  name: 'App',
  components: {
    RegistrationForm,
    ParticipantsTable,
    WinnersBlock,
  },
  data() {
    return {
      participants: [] as Participant[],
      winners: [] as Participant[],
    }
  },
  created() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        this.participants = JSON.parse(raw)
      } catch {
        this.participants = []
      }
    }
    const rawW = localStorage.getItem(WINNERS_KEY)
    if (rawW) {
      try {
        this.winners = JSON.parse(rawW)
      } catch {
        this.winners = []
      }
    }
  },
  watch: {
    participants: {
      handler(newVal: Participant[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
      },
      deep: true,
    },
    winners: {
      handler(newVal: Participant[]) {
        localStorage.setItem(WINNERS_KEY, JSON.stringify(newVal))
      },
      deep: true,
    },
  },
  methods: {
    addParticipant(p: Participant) {
      this.participants.push(p)
    },
    deleteParticipant(id: string) {
      this.participants = this.participants.filter(x => x.id !== id)
      this.winners = this.winners.filter(w => w.id !== id)
    },
    removeWinner(id: string) {
      this.winners = this.winners.filter(w => w.id !== id)
    },
    selectNewWinner() {
      const candidates = this.participants.filter(
        p => !this.winners.find(w => w.id === p.id)
      )
      if (candidates.length === 0) return
      const idx = Math.floor(Math.random() * candidates.length)
      const winner =candidates[idx]
      if(!winner) return
      this.winners.push(winner)
    }
  }
})
</script>

<style>
</style>
