<template>
  <textarea
    class="w-full p-1 bg-transparent focus:outline-none focus:border-none focus:bg-gray-800 focus:rouned-md"
    v-model="value"
    @blur="$emit('commit')"
  />
</template>

<script setup lang="ts">
  //Two way binding
  const value = defineModel<string>()

  defineEmits<{
    (e: 'commit'): void
  }>()
</script>

<style scoped></style>
