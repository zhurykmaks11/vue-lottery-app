<template>
  <div class="container py-4">
    <WinnersBlock
      :winners="winners"
      :participantsCount="participants.length"
      @remove-winner="removeWinner"
      @new-winner="selectNewWinner"
    />

    <SearchBar @filter-by-name="onFilter" />

    <div class="row mt-3">
      <div class="col-12 col-lg-12">
        <RegistrationForm :existingEmails="participants.map((p) => p.email)" @save="handleSave" />
      </div>

      <div class="col-12 mt-4">
        <ParticipantsTable
          :participants="filteredList"
          @edit="openEditModal"
          @delete="openDeleteModal"
          @sort="onSort"
        />
      </div>
    </div>

    <!-- Edit Modal -->
    <UiModal :show="showEditModal" @close="closeEditModal">
      <template #header><h5>Редагувати учасника</h5></template>
      <template #body>
        <RegistrationForm
          :initialData="editing"
          :existingEmails="participants.map((p) => p.email)"
          @save="updateParticipant"
        />
      </template>
      <template #footer>
        <button class="btn btn-secondary me-2" @click="closeEditModal">Скасувати</button>
      </template>
    </UiModal>


    <UiModal :show="showDeleteModal" @close="closeDeleteModal">
      <template #header><h5>Підтвердження видалення</h5></template>
      <template #body>
        Ви дійсно бажаєте видалити учасника <strong>{{ deleting?.name }}</strong> ({{
          deleting?.email
        }})?
      </template>
      <template #footer>
        <button class="btn btn-secondary me-2" @click="closeDeleteModal">Ні</button>
        <button class="btn btn-danger" @click="performDelete">Так, видалити</button>
      </template>
    </UiModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import WinnersBlock from './components/WinnersBlock.vue'
import SearchBar from './components/SearchBar.vue'
import UiModal from './components/ui/UiModal.vue'
import type { Participant } from './types'
import { generateId } from './utils/validation'

const STORAGE_KEY = 'vue_lottery_participants_v1'
const WINNERS_KEY = 'vue_lottery_winners_v1'

export default defineComponent({
  name: 'App',
  components: { RegistrationForm, ParticipantsTable, WinnersBlock, SearchBar, UiModal },
  data() {
    return {
      participants: [] as Participant[],
      winners: [] as Participant[],
      filterQuery: '',
      showEditModal: false,
      showDeleteModal: false,
      editing: null as Participant | null,
      deleting: null as Participant | null,
      sortField: 'name' as 'name' | 'dob',
      sortAsc: true as boolean,
    }
  },
  created() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) this.participants = JSON.parse(raw)
    const rawW = localStorage.getItem(WINNERS_KEY)
    if (rawW) this.winners = JSON.parse(rawW)
  },
  watch: {
    participants: {
      handler(v) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
      },
      deep: true,
    },
    winners: {
      handler(v) {
        localStorage.setItem(WINNERS_KEY, JSON.stringify(v))
      },
      deep: true,
    },
  },
  computed: {
    filteredList(): Participant[] {
      let list = this.participants.slice()
      if (this.filterQuery)
        list = list.filter((p) => p.name.toLowerCase().includes(this.filterQuery.toLowerCase()))
      if (this.sortField === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
      else if (this.sortField === 'dob')
        list.sort((a, b) => new Date(a.dob).getTime() - new Date(b.dob).getTime())
      if (!this.sortAsc) list.reverse()
      return list
    },
  },
  methods: {
    handleSave(p: Participant) {
      if (!p.id) p.id = generateId()
      if (this.participants.some((x) => x.email === p.email && x.id !== p.id)) {
        return
      }
      const idx = this.participants.findIndex((x) => x.id === p.id)
      if (idx === -1) this.participants.push(p)
      else this.participants.splice(idx, 1, p)
    },

    openEditModal(p: Participant) {
      this.editing = { ...p }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editing = null
    },

    updateParticipant(updated: Participant) {
      const idx = this.participants.findIndex((x) => x.id === updated.id)
      if (idx !== -1) this.participants.splice(idx, 1, updated)
      this.closeEditModal()
    },

    openDeleteModal(p: Participant) {
      this.deleting = p
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleting = null
    },

    performDelete() {
      if (!this.deleting) return
      this.participants = this.participants.filter((x) => x.id !== this.deleting!.id)
      this.winners = this.winners.filter((w) => w.id !== this.deleting!.id)
      this.closeDeleteModal()
    },

    removeWinner(id: string) {
      this.winners = this.winners.filter((w) => w.id !== id)
    },

    selectNewWinner() {
      const candidates = this.participants.filter((p) => !this.winners.find((w) => w.id === p.id))
      if (!candidates.length) return
      const idx = Math.floor(Math.random() * candidates.length)
      const winner = candidates[idx]
      if (!winner) return

      this.winners.push(winner)
    },

    onFilter(q: string) {
      this.filterQuery = q
    },
    onSort(payload: { field: string; asc: boolean }) {
      this.sortField = payload.field as 'name' | 'dob'
      this.sortAsc = payload.asc
    },
  },
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
