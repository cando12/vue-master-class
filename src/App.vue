<script setup lang="ts">

const errorStore = useErrorStore()
onErrorCaptured((error) => {
  errorStore.setError({ error: error.message, customCode: 500 })
})
</script>

<template>
  <AuthLayout>
    <AppErrorPage v-if="errorStore.activeError" />
    <RouterView v-else v-slot="{ Component, route }">
      <Suspense v-if="Component">
        <Component :is="Component" :key="route.name" />
        <template #fallback>
          <div class="flex items-center justify-center h-screen">
            <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>
