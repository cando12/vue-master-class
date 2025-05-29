import type { CustomError, CustomPostgrestError } from "@/types/Error"
import type { PostgrestError } from "@supabase/supabase-js"

export const useErrorStore = defineStore('error-store',()=>{
  const activeError = ref<CustomError | CustomPostgrestError | null>(null)
  const isCustomError = ref(false)

  const setError = ({error,customCode}:{error:string | PostgrestError | Error,customCode?:number})=>{

    if(typeof error === 'string' || error instanceof Error){
      isCustomError.value = true
    }

    if(typeof error === 'string' || error instanceof Error){
      activeError.value = typeof error === 'string' ? new Error(error) : error
      activeError.value.customCode = customCode || 500
      return
    }

    activeError.value = error
    if ('code' in error) {
      (activeError.value as CustomPostgrestError).statusCode = customCode || 500
    } else {
      (activeError.value as CustomError).customCode = customCode || 500
    }
  }

  const clearError = ()=>{
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    setError,
    isCustomError,
    clearError
  }
})
