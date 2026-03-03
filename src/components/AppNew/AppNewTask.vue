<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create New Task</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="createTask"
        submit-label="Create Task"
        :config="{
          validationVisibility: 'submit'
        }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          placeholder="My new task"
          validation="required|length:1,255"
        />
        <FormKit
          type="select"
          name="profile_id"
          id="profile_id"
          label="User"
          placeholder="Select a user"
          :options="selectOptions.profiles"
          validation="required"
        />
        <FormKit
          type="select"
          name="project_id"
          id="project_id"
          label="Project"
          placeholder="Select a project"
          :options="selectOptions.projects"
          validation="required"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          placeholder="Task description"
          validation="length:0,255"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
  import type { CreateNewTask } from '@/types/CreateNewForm'
  import {
    createNewTaskQuery,
    profilesQuery,
    projectsQuery
  } from '@/utils/supaQueries'

  const sheetOpen = defineModel<boolean>()

  type SelectOptions = {
    label: string
    value: number | string
  }
  const selectOptions = ref({
    projects: [] as SelectOptions[],
    profiles: [] as SelectOptions[]
  })

  const getProjectOptions = async () => {
    const { data: allProjects } = await projectsQuery

    if (!allProjects) return

    allProjects.forEach(project => {
      selectOptions.value.projects.push({
        label: project.name,
        value: project.id
      })
    })
  }

  const getProfileOptions = async () => {
    const { data: allProfiles } = await profilesQuery

    if (!allProfiles) return

    allProfiles.forEach(profile => {
      selectOptions.value.profiles.push({
        label: profile.full_name,
        value: profile.id
      })
    })
  }

  // Delay fetching options until the sheet is open to avoid unnecessary queries
  const getOptions = async () => {
    await Promise.all([getProjectOptions(), getProfileOptions()])
  }

  getOptions()

  const { profile } = storeToRefs(useAuthStore())

  const createTask = async (formData: CreateNewTask) => {
    const task = {
      ...formData,
      collaborators: [profile.value?.id || '']
    }

    const { error } = await createNewTaskQuery(task)
    if (error) {
      console.error('Error creating task:', error)
    } else {
      sheetOpen.value = false
    }
  }
</script>

<style scoped></style>
