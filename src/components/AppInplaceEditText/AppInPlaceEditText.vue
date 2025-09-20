<template>
  <input
    class="w-full p-1 bg-transparent focus:outline-none focus:border-none focus:bg-gray-800 focus:rouned-md"
    type="text"
    v-model="value"
    @blur="$emit('commit')"
    @keyup.enter="($event.target as HTMLInputElement).blur()"
  />
</template>

<script setup lang="ts">
  //Two way binding
  const value = defineModel()

  defineEmits<{
    (e: 'commit'): void
  }>()
</script>

<style scoped></style>
