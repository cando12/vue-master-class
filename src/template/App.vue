<script setup lang="ts">
  import TopNavbar from '@/components/Layout/TopNavbar.vue'
  import SideBar from '@/components/Layout/SideBar.vue'
</script>

<template>
  <SideBar />
  <div class="flex flex-col lg:ml-52 ml-16 transition-[margin]">
    <TopNavbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
