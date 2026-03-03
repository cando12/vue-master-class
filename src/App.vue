<script setup lang="ts">
  import { Component } from 'lucide-vue-next'

  const errorStore = useErrorStore()
  onErrorCaptured(error => {
    errorStore.setError({ error: error.message, customCode: 500 })
  })

  onMounted(() => {
    useAuthStore().trackAuthChanges()
  })

  // Switch layout dynamically based on auth state
  const { user } = storeToRefs(useAuthStore())
  const AuthLayout = defineAsyncComponent(
    () => import('./components/Layout/main/AuthLayout.vue')
  )
  const GuestLayout = defineAsyncComponent(
    () => import('./components/Layout/main/GuestLayout.vue')
  )
</script>

<template>
  <Component :is="user ? AuthLayout : GuestLayout">
    <AppErrorPage v-if="errorStore.activeError" />
    <RouterView v-else v-slot="{ Component, route }">
      <Suspense v-if="Component">
        <Component :is="Component" :key="route.name" />
        <template #fallback>
          <div class="flex items-center justify-center h-screen">
            <div
              class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
            ></div>
          </div>
        </template>
      </Suspense>
    </RouterView>
  </Component>
</template>
