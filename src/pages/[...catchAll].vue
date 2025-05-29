<script setup lang="ts">
import AppErrorPage from '@/components/AppError/AppErrorPage.vue'

const errorStore = useErrorStore()

errorStore.setError({error: 'Page not found', customCode: 404})
</script>

<template>
  <AppErrorPage />
</template>

