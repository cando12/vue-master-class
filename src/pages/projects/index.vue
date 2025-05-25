<script setup lang="ts">
  import { supabase } from '@/lib/supabaseClient'
  import { ref } from 'vue'
  import type { Tables } from '../../../database/types'
  import type { ColumnDef } from '@tanstack/vue-table'
  import { h } from 'vue'
  import DataTable from '@/components/ui/data-table/DataTable.vue'
import { RouterLink } from 'vue-router'

  const projects = ref<Tables<'projects'>[] | null>(null)
  ;(async () => {
    const { data, error } = await supabase.from('projects').select()

    if (error) console.log(error)

    projects.value = data
  })()

  const columns: ColumnDef<Tables<'projects'>>[] = [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-left' }, 'Status'),
  },
  {
    accessorKey: 'collaborators',
    header: () => h('div', { class: 'text-left' }, 'Collaborators'),
  }
]
</script>

<template>
    <DataTable v-if="projects" :columns="columns" :data="projects">
      <template #cell-name="{ cell }">
        <RouterLink :to="`/projects/${cell.row.original.slug}`"
        class="text-left font-medium hover:bg-muted/50 block w-full">
        {{ cell.getValue() }}
      </RouterLink>
      </template>
    </DataTable>
</template>
