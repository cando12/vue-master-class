<script setup lang="ts">
  import { ref } from 'vue'
  import  { tasksWithProjectsQuery } from '@/utils/supaQueries'
  import type { TasksWithProjects } from '@/utils/supaQueries'
  import { columns } from '@/utils/tableColumns/tasksColumns'

  usePageStore().pageData.title = 'Tasks'



  const tasks = ref<TasksWithProjects | null>(null)
  const getTasks = async () => {
    const { data, error,status } = await tasksWithProjectsQuery
    if (error) useErrorStore().setError({error: error.message, customCode: status})


    tasks.value = data
  }

  await getTasks();

</script>

<template>
  <DataTable v-if="tasks" :columns="columns" :data="tasks" />
</template>
