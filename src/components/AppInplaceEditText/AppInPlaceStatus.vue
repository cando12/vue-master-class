<template>
  <div class="text-2xl cursor-pointer" @click="toggleValue">
    <Transition mode="out-in">
      <iconify-icon
        icon="lucide:circle-check"
        v-if="value === 'completed'"
        class="text-green-500"
      />
      <iconify-icon icon="lucide:circle-dot" v-else class="text-gray-500" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['commit'])
  const value = defineModel<'in-progress' | 'completed'>()

  // define props with default value
  const { readOnly = false } = defineProps<{
    readOnly?: boolean
  }>()

  const toggleValue = () => {
    if (readOnly) return
    value.value = value.value === 'in-progress' ? 'completed' : 'in-progress'
    emit('commit')
  }
</script>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: transform 0.1s;
  }

  .v-enter-from,
  .v-leave-to {
    transform: scale(0.5);
  }
</style>
