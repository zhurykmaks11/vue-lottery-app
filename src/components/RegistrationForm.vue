<script setup lang="ts">
import { reactive, computed, defineEmits } from 'vue'
import {
  generateId,
  emailRegex,
  phoneRegex,
  isFutureDate,
  isTooOldDate,
  flexiblePhoneRegex,
} from '../utils/validation.ts'
import type { Participant } from '../types'

const emit = defineEmits<{
  (e: 'saved', participant: Participant): void
}>()

interface RegistrationForm {
  name: string
  dob: string // Date of Birth
  email: string
  phone: string
}

interface FormErrors {
  name: string | null
  dob: string | null
  email: string | null
  phone: string | null
}

interface TouchedFields {
  name: boolean
  dob: boolean
  email: boolean
  phone: boolean
}

const initialFormState: RegistrationForm = { name: '', dob: '', email: '', phone: '' }
const initialTouchedState: TouchedFields = { name: false, dob: false, email: false, phone: false }

const form: RegistrationForm = reactive({ ...initialFormState })
const touched: TouchedFields = reactive({ ...initialTouchedState })

const isRequired = (value: string): string | null => {
  return value.trim() ? null : "Це поле є обов'язковим."
}

const errors = computed<FormErrors>(() => {
  const currentErrors: FormErrors = {
    name: isRequired(form.name),
    dob: isRequired(form.dob),
    email: isRequired(form.email),
    phone: isRequired(form.phone),
  }

  if (currentErrors.name === null && form.name && form.name.length < 3) {
    currentErrors.name = "Ім'я має бути не менше 3 символів."
  }

  if (currentErrors.dob === null && form.dob && isFutureDate(form.dob)) {
    currentErrors.dob = 'Дата народження не може бути у майбутньому.'
  }
  if (currentErrors.dob === null && form.dob && isTooOldDate(form.dob)) {
    currentErrors.dob = 'Дата народження не можу бути раніше 1900 року'
  }

  if (currentErrors.email === null && form.email && !emailRegex.test(form.email)) {
    currentErrors.email = 'Будь ласка, введіть коректну електронну пошту.'
  }
  if (currentErrors.phone === null && form.phone && !flexiblePhoneRegex.test(form.phone)) {
    currentErrors.phone ='Будь ласка номер розпочинайте з +380';
  }
  if (currentErrors.phone === null && form.phone && !phoneRegex.test(form.phone)) {
    currentErrors.phone = 'Будь ласка, введіть коректний номер телефону (мін. 6 символів).'
  }
  return currentErrors
})

const hasErrors = computed<boolean>(() => {
  return Object.values(errors.value).some((error) => error !== null)
})

const resetForm = () => {
  Object.assign(form, initialFormState)
  Object.assign(touched, initialTouchedState)
}

const onSave = () => {
  ;(Object.keys(touched) as (keyof TouchedFields)[]).forEach((key) => {
    touched[key] = true
  })
  if (hasErrors.value) {
    console.warn('Валідація не пройдена. Помилки форми:', errors.value)
    return
  }
  const newParticipant: Participant = {
    ...form,
    id: generateId(),
  }
  emit('saved', newParticipant)
  resetForm()
  console.log('Учасник успішно зареєстрований:', newParticipant)
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title text-uppercase mb-3">REGISTER FORM</h5>
      <p class="text-muted small mb-4">Please fill in all the fields.</p>

      <form @submit.prevent="onSave" novalidate>
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input
            v-model="form.name"
            :class="['form-control', touched.name && errors.name ? 'is-invalid' : '']"
            type="text"
            placeholder="Enter user name"
            @blur="touched.name = true"
          />
          <div class="invalid-feedback">{{ errors.name }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Date of Birth</label>
          <input
            v-model="form.dob"
            :class="['form-control', touched.dob && errors.dob ? 'is-invalid' : '']"
            type="date"
            placeholder="mm/dd/yyyy"
            @blur="touched.dob = true"
          />
          <div class="invalid-feedback">{{ errors.dob }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            :class="['form-control', touched.email && errors.email ? 'is-invalid' : '']"
            type="email"
            placeholder="Enter email"
            @blur="touched.email = true"
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Phone number</label>
          <input
            v-model="form.phone"
            :class="['form-control', touched.phone && errors.phone ? 'is-invalid' : '']"
            type="text"
            placeholder="Enter Phone number"
            @blur="touched.phone = true"
          />
          <div class="invalid-feedback">{{ errors.phone }}</div>
        </div>

        <div class="d-flex justify-content-end mt-4">
          <button type="submit" class="btn btn-info text-white">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
