<script setup lang="ts">
  interface LinkProp {
    title: string
    to?: string
    icon: string
  }

  defineProps<{
    links: LinkProp[]
  }>()
  defineEmits<{
    actionClicked: [string]
  }>()
</script>

<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exactActiveClass="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </RouterLink>

    <div
      v-else
      class="nav-link cursor-pointer"
      @click="$emit('actionClicked', link.title)"
    >
      <iconify-icon :icon="link.icon"></iconify-icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </div>
  </template>
</template>

<style scoped>
  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    transition: color 0.2s;
    border-radius: 0.5rem;
  }

  .nav-link:hover {
    color: hsl(var(--primary));
  }

  .nav-link {
    color: hsl(var(--muted-foreground));
  }
</style>
