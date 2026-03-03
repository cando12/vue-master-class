import { projectQuery, projectsQuery, updateProjectQuery, type Project, type Projects } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const project = ref<Project | null>(null)

  const loadProjects = useMemoize(async (key:string) => await projectsQuery)
  const loadProject = useMemoize(async (slug:string) => await projectQuery(slug))

  interface ValidateCacheProps{
    ref: typeof projects | typeof project,
    query: typeof projectsQuery | typeof projectQuery,
    key: string,
    loaderFn: typeof loadProjects | typeof loadProject
  }

  // This function checks if the cached data is still valid by comparing it with the latest data from the database. If the data has changed, it updates the cache and the corresponding ref.
  const validateCache = ({
    ref,
    query,
    key,
    loaderFn
  }:ValidateCacheProps) =>{
    if(ref.value){
      const finalQuery = typeof query === 'function' ? query(key) : query
      finalQuery.then(({data,error})=>{
        if(JSON.stringify(ref.value) === JSON.stringify(data)){
          return
        }else{
         loaderFn.delete(key)
         if(!error && data){
          ref.value = data
         }
        }
      })
    }
  }

  const getProjects = async () => {

    projects.value = null

    const { data, error, status } = await loadProjects('projects')
    if (error)
      useErrorStore().setError({ error: error.message, customCode: status })
    projects.value = data
    validateCache({
      ref: projects,
      query: projectsQuery,
      key: 'projects',
      loaderFn: loadProjects
    })
  }

  const getProject = async (slug:string) => {
    project.value = null

    const { data, error,status } = await loadProject(slug)

    if (error) useErrorStore().setError({error: error.message, customCode: status})

    if(data){
      project.value = data
    }

    validateCache({
      ref: project,
      query: projectQuery,
      key: slug,
      loaderFn: loadProject
    })
  }

  const updateProject = async () => {
    if(!project.value) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {tasks, id,...projectProperties} = project.value
    const { data, error, status } = await updateProjectQuery(projectProperties, project.value.id)
    if (error) useErrorStore().setError({ error: error.message, customCode: status })
    if (data) project.value = data
  }

  return {
    projects,
    project,
    getProjects,
    getProject,
    updateProject
  }
})
