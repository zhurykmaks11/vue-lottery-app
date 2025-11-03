<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between mb-2">
        <div>
          <button class="btn btn-sm btn-outline-secondary me-2" @click="toggleSort('name')">
            <i class="bi bi-sort-alpha-down"></i> Ім'я
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="toggleSort('dob')">
            <i class="bi bi-sort-down"></i> ДН
          </button>
        </div>
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Ім'я</th>
            <th>Дата народження</th>
            <th>Email</th>
            <th>Тел.</th>
            <th>Редагувати</th>
            <th>Видалити</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in sorted" :key="p.id">
            <td>{{ i + 1 }}</td>
            <td>{{ p.name }}</td>
            <td>{{ formatDate(p.dob) }}</td>
            <td>{{ p.email }}</td>
            <td>{{ p.phone }}</td>
            <td>
              <button class="btn btn-sm btn-warning" @click="$emit('edit', p)">Редагувати</button>
            </td>
            <td>
              <button class="btn btn-sm btn-danger" @click="$emit('delete', p)">Видалити</button>
            </td>
          </tr>
          <tr v-if="sorted.length === 0">
            <td colspan="7" class="text-center text-muted">Немає учасників</td>
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
    participants: { type: Array as () => Participant[], required: true },
    sortFieldProp: { type: String, default: 'name' },
    sortAscProp: { type: Boolean, default: true },
  },
  emits: ['edit', 'delete', 'sort'],
  data() {
    return {
      sortField: this.sortFieldProp as 'name' | 'dob',
      asc: this.sortAscProp as boolean,
    }
  },
  computed: {
    sorted(): Participant[] {
      const arr = [...this.participants]
      if (this.sortField === 'name') {
        arr.sort((a, b) => a.name.localeCompare(b.name))
      } else if (this.sortField === 'dob') {
        arr.sort((a, b) => new Date(a.dob).getTime() - new Date(b.dob).getTime())
      }
      if (!this.asc) arr.reverse()
      return arr
    },
  },
  methods: {
    formatDate(d: string) {
      if (!d) return ''
      const [y, m, day] = d.split('-')
      return `${day}/${m}/${y}`
    },
    toggleSort(field: 'name' | 'dob') {
      if (this.sortField === field) this.asc = !this.asc
      else {
        this.sortField = field
        this.asc = true
      }
      this.$emit('sort', { field: this.sortField, asc: this.asc })
    },
  },
})
</script>
