<template>
  <transition name="fade">
    <div v-if="show" class="modal-backdrop" @click.self="close">
      <div class="modal-dialog" role="dialog">
        <div class="modal-content p-3">
          <header class="modal-header">
            <slot name="header"></slot>
          </header>

          <section class="modal-body">
            <slot name="body"></slot>
          </section>

          <footer class="modal-footer text-end">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'UiModal',
  props: {
    show: { type: Boolean, required: true },
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close')
    },
  },
  setup(props, ctx) {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ctx.emit('close')
    }
    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
    return {}
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-dialog {
  max-width: 520px;
  width: 100%;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
.modal-header {
  padding-bottom: 0.5rem;
}
.modal-body {
  padding: 0.5rem 0;
}
.modal-footer {
  padding-top: 0.5rem;
}
</style>
