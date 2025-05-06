<script setup lang="ts">
  import { supabase } from '@/lib/supabaseClient'

  const { data, error } = await supabase.from('countries').select()

  console.log(supabase)
</script>

<template>
  <main>
    <router-view />
  </main>
</template>
