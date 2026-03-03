<script setup lang="ts">
  import { columns } from '@/utils/tableColumns/tasksColumns'

  usePageStore().pageData.title = 'Tasks'

  const tasksLoader = useTasksStore()
  const { tasks } = storeToRefs(tasksLoader)
  const { getTasks } = tasksLoader

  await getTasks()

  const { getGroupCollabs, groupedCollabs } = useCollabs()
  getGroupCollabs(tasks.value ?? [])

  const columnsWithCollabs = columns(groupedCollabs)
</script>

<template>
  <DataTable v-if="tasks" :columns="columnsWithCollabs" :data="tasks" />
</template>
