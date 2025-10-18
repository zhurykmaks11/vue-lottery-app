<template>
  <div class="card mt-4"> <div class="card-body">
    <div v-if="participants.length === 0" class="text-muted">No participants yet.</div>

    <table v-else class="table table-striped">
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Date of Birth</th>
        <th>Email</th>
        <th>Phone number</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(p, idx) in participants" :key="p.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ p.name }}</td>
        <td>{{ formatDate(p.dob) }}</td>
        <td>{{ p.email }}</td>
        <td>{{ p.phone }}</td>
        <td>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Participant } from '../types'

export default defineComponent({
  name: 'ParticipantsTable',
  props: {
    participants: {
      type: Array as () => Participant[],
      required: true
    }
  },
  emits: ['delete'],
  methods: {
    formatDate(d: string): string {
      if (!d) return ''
      const parts = d.split('-')
      if (parts.length !== 3) return d
      return `${parts[1]}/${parts[2]}/${parts[0]}`
    }
  }
})
</script>

<style scoped>
</style>
