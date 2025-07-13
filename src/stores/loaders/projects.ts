import { projectsQuery, type Projects } from "@/utils/supaQueries"
import { useMemoize } from "@vueuse/core"

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const loadProjects = useMemoize(async (key:string) => await projectsQuery)

  const validateCache = () =>{
    if(projects.value?.length){
      projectsQuery.then(({data})=>{
        if(JSON.stringify(data) === JSON.stringify(projects.value)){
          return
        }else{
          loadProjects.delete('projects')
        }
      })
    }
  }

  const getProjects = async () => {
    const { data, error, status } = await loadProjects('projects')
    if (error)
      useErrorStore().setError({ error: error.message, customCode: status })
    projects.value = data
    validateCache()
  }

  return {
    projects,
    getProjects
  }
})
