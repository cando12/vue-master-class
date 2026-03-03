import {
  deleteTaskQuery,
  taskQuery,
  tasksWithProjectsQuery,
  updateTaskQuery,
  type Task,
  type TasksWithProjects
} from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'

export const useTasksStore = defineStore('tasks-store', () => {
  const tasks = ref<TasksWithProjects | null>(null)
  const task = ref<Task | null>(null)

  const loadTasks = useMemoize(
    async (key: string) => await tasksWithProjectsQuery
  )
  const loadTask = useMemoize(async (slug: number) => await taskQuery(slug))

  interface ValidateCacheProps {
    ref: typeof tasks | typeof task
    query: typeof tasksWithProjectsQuery | typeof taskQuery
    key: string | number
    loaderFn: typeof loadTasks | typeof loadTask
  }

  const validateCache = ({ ref, query, key, loaderFn }: ValidateCacheProps) => {
    if (ref.value) {
      const finalQuery = typeof query === 'function' ? query(key) : query
      finalQuery.then(({ data, error }) => {
        if (JSON.stringify(ref.value) === JSON.stringify(data)) {
          return
        } else {
          loaderFn.delete(key)
          if (!error && data) {
            ref.value = data
          }
        }
      })
    }
  }

  const getTasks = async () => {
    tasks.value = null

    const { data, error, status } = await loadTasks('tasks')
    if (error)
      useErrorStore().setError({ error: error.message, customCode: status })
    else tasks.value = data
    validateCache({
      ref: tasks,
      query: tasksWithProjectsQuery,
      key: 'tasks',
      loaderFn: loadTasks
    })
  }

  const getTask = async (id: string) => {
    task.value = null
    const { data, error, status } = await loadTask(Number(id))
    if (error)
      useErrorStore().setError({ error: error.message, customCode: status })
    else task.value = data
    validateCache({
      ref: task,
      query: taskQuery,
      key: id,
      loaderFn: loadTask
    })
  }

  const updateTask = async () => {
    if (!task.value) return

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projects, id, ...taskProperties } = task.value

    await updateTaskQuery(taskProperties, task.value.id)
  }

  const deleteTask = async () => {
    if (!task.value) return

    await deleteTaskQuery(task.value.id)
  }

  return {
    tasks,
    task,
    getTasks,
    getTask,
    updateTask,
    deleteTask
  }
})
