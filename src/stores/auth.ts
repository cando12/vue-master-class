import { supabase } from "@/lib/supabaseClient"
import { profileQuery } from "@/utils/supaQueries"
import type { Session, User } from "@supabase/supabase-js"
import type { Tables } from "database/types"

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<User | null>(null)
  const profile = ref<Tables<"profiles"> | null>(null)
  const isTrackingAuthChanges = ref(false)

  const setProfile = async ()=>{
    if(!user.value) {
      profile.value = null
      return
    }
    if(!profile.value || profile.value.id !== user.value.id){
      //.fetch profile data
      const {data,error} = await profileQuery({column:'id',value:user.value.id})
      if(error) throw error
      profile.value = data || null
    }
  }

  const setAuth = async (userSession:null | Session=null)=>{
    if(userSession){
      user.value = userSession.user
      await setProfile()
      return
    }
    user.value = null
    profile.value = null
  }

  const getSession = async ()=>{
    const {data,error} = await supabase.auth.getSession()
    if(error) throw error
    if(data.session?.user) await setAuth(data.session)
  }

  const trackAuthChanges = () =>{
    if(isTrackingAuthChanges.value) return

    isTrackingAuthChanges.value = true
    supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        await setAuth(session)
      }, 0)
    })
  }

  return {
    user,
    profile,
    setAuth,
    getSession,
    trackAuthChanges
  }
})

if(import.meta.hot){
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore,import.meta.hot))
}
