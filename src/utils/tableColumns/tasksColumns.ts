import type { ColumnDef } from '@tanstack/vue-table'
import type { TasksWithProjects } from '../supaQueries'
import { RouterLink } from 'vue-router'
import type { GroupedCollabs } from '@/types/GroupedCollabs'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AppInPlaceStatus from '@/components/AppInplaceEditText/AppInPlaceStatus.vue'

export const columns = (
  collabs: Ref<GroupedCollabs>
): ColumnDef<TasksWithProjects[0]>[] => [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
    cell: ({ row }) => {
      return h(
        RouterLink,
        {
          to: `/tasks/${row.original.id}`,
          class: 'text-left font-medium hover:bg-muted block w-full'
        },
        () => row.getValue('name')
      )
    }
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-left font-medium' },
        h(AppInPlaceStatus, { modelValue: row.original.status, readOnly: true })
      )
    }
  },
  {
    accessorKey: 'due_date',
    header: () => h('div', { class: 'text-left' }, 'Due Date'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-left font-medium' },
        row.getValue('due_date')
      )
    }
  },
  {
    accessorKey: 'projects',
    header: () => h('div', { class: 'text-left' }, 'Project'),
    cell: ({ row }) => {
      return row.original.projects
        ? h(
            RouterLink,
            {
              to: `/projects/${row.original.projects.slug}`,
              class: 'text-left font-medium hover:bg-muted block w-full'
            },
            () => row.original.projects?.name
          )
        : ''
    }
  },
  {
    accessorKey: 'collaborators',
    header: () => h('div', { class: 'text-left' }, 'Collaborators'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-left font-medium flex items-center gap-1' },
        collabs.value[row.original.id]
          ? collabs.value[row.original.id].map((collab, index) => {
              return h(RouterLink, { to: `/users/${collab.username}` }, () => {
                return h(
                  Avatar,
                  {
                    class: 'hover:scale-110 transition-transform',
                    style: {
                      zIndex: collabs.value[row.original.id].length - index
                    }
                  },
                  () => h(AvatarImage, { src: collab.avatar_url || '' })
                )
              })
            })
          : row.original.collaborators.map((_, index) => {
              return h(
                Avatar,
                {
                  class: 'animate-pulse',
                  style: { zIndex: row.original.collaborators.length - index }
                },
                () => h(AvatarFallback)
              )
            })
      )
    }
  }
]
