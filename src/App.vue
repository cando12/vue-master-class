<script setup lang="ts">

</script>

<template>
  <AuthLayout>
    <RouterView v-slot="{ Component,route }">
      <Suspense v-if="Component">
        <Component  :is="Component" :key="route.name" />
        <template #fallback>
          <div class="flex items-center justify-center h-screen">
            <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>
