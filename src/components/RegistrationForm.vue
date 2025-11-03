<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Реєстрація</h5>

      <form @submit.prevent="onSave" novalidate>
        <UiInput
          label="Ім'я"
          v-model="form.name"
          :error="errors.name || ''"
          @blur="touched.name = true"
          @enter="onSave"
        />

        <UiInput
          label="Дата народження"
          v-model="form.dob"
          type="date"
          :error="errors.dob || ''"
          @blur="touched.dob = true"
        />

        <UiInput
          label="Email"
          v-model="form.email"
          type="email"
          :error="errors.email || ''"
          @blur="touched.email = true"
        />

        <UiInput
          label="Телефон"
          v-model="form.phone"
          :error="errors.phone || ''"
          @blur="touched.phone = true"
        />

        <div class="d-flex justify-content-end mt-3">
          <UiButton variant="info" @click="onSave">
            {{ initialData ? 'Оновити дані' : 'Зберегти' }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UiInput from './ui/UiInput.vue'
import UiButton from './ui/UiButton.vue'
import {
  generateId,
  emailRegex,
  phoneRegex,
  isFutureDate,
  isTooOldDate,
  flexiblePhoneRegex,
} from '../utils/validation'
import type { Participant } from '../types'

export default defineComponent({
  name: 'RegistrationForm',
  components: { UiInput, UiButton },
  props: {
    existingEmails: {
      type: Array as () => string[],
      default: () => [],
    },
    initialData: {
      type: Object as () => Participant | null,
      default: null,
    },
  },
  emits: ['save'],
  data() {
    return {
      form: {
        id: this.initialData?.id || '',
        name: this.initialData?.name || '',
        dob: this.initialData?.dob || '',
        email: this.initialData?.email || '',
        phone: this.initialData?.phone || '',
      } as Participant,
      touched: {
        name: false,
        dob: false,
        email: false,
        phone: false,
      } as Record<string, boolean>,
      errors: {
        name: null,
        dob: null,
        email: null,
        phone: null,
      } as Record<string, string | null>,
    }
  },
  methods: {
    validate(): boolean {
      const e: Record<string, string | null> = {
        name: null,
        dob: null,
        email: null,
        phone: null,
      }

      if (!this.form.name || this.form.name.trim().length < 3) e.name = 'Ім’я мінімум 3 символи'

      if (!this.form.dob) e.dob = 'Дата обов’язкова'
      else if (isFutureDate(this.form.dob)) e.dob = 'Дата не може бути у майбутньому'
      else if (isTooOldDate(this.form.dob)) e.dob = 'Дата не може бути раніше 1900 року'

      if (!this.form.email) e.email = 'Email обов’язковий'
      else if (!emailRegex.test(this.form.email)) e.email = 'Некоректний email'
      else if (
        this.existingEmails.includes(this.form.email) &&
        (!this.initialData || this.form.email !== this.initialData.email)
      )
        e.email = 'Такий email вже використовується'

      if (!this.form.phone) e.phone = 'Телефон обов’язковий'
      else if (!phoneRegex.test(this.form.phone)) e.phone = 'Некоректний номер'
      else if (!flexiblePhoneRegex.test(this.form.phone))
        e.phone = 'Телефон має містити від розпочинатися з +380 '

      this.errors = e
      return !Object.values(e).some((x) => x !== null)
    },

    onSave() {
      Object.keys(this.touched).forEach((k) => (this.touched[k] = true))
      if (!this.validate()) return

      const payload: Participant = { ...this.form }
      if (!payload.id) payload.id = generateId()

      this.$emit('save', payload)

      if (!this.initialData) {
        this.form = { id: '', name: '', dob: '', email: '', phone: '' }
        this.touched = { name: false, dob: false, email: false, phone: false }
      }
    },
  },
})
</script>
