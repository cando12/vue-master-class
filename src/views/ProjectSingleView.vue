<template>
  <div>
    <h1>Project {{ id }}</h1>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const id = computed(() => route.params?.id)
</script>

<style scoped></style>
