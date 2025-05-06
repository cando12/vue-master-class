<template>
  <div>
    <h1
      class="text-2xl font-bold"
      @click="handleClick"
      data-testid="home-page-title"
    >
      Home Page
    </h1>
  </div>
</template>

<script setup lang="ts">
  const handleClick = () => {
    console.log('Clicked!')
  }
</script>

<style scoped></style>
