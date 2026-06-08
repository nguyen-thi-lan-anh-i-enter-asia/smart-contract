<template>
  <Transition name="toast">
    <div v-if="show" data-rht-toaster="" class="fixed z-9999 top-4 left-4 right-4 bottom-4 pointer-events-none">
      <div class="absolute left-0 right-0 flex justify-end top-0 transition-all duration-300">
        <div class="bg-gray-900 border border-white/10 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto min-w-50">
          <div v-if="!isError" class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-bold">
            ✓
          </div>
          <div v-else class="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 text-xs font-bold">
            ✕
          </div>
          <div role="status" aria-live="polite" class="text-sm font-medium text-gray-200">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  isError: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>