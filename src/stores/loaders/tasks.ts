import {
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
  const loadTask = useMemoize(async (id: number) => await taskQuery(id))

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

  const getTask = async (id: number) => {
    task.value = null
    const { data, error, status } = await loadTask(id)
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

  const updateTask = async (updatedTask: Partial<Task>, id: number) => {
    const { error, status } = await updateTaskQuery(updatedTask, id)
    if (error) {
      useErrorStore().setError({ error: error.message, customCode: status })
    } else {
      loadTask.delete(id)
      getTask(id)
    }
  }

  return {
    tasks,
    task,
    getTasks,
    getTask,
    updateTask
  }
})
