import { supabase } from "@/lib/supabaseClient";
import type { RegisterForm } from "@/types/AuthForm";


export const register = async (formData:RegisterForm)=>{
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password
  })

  if (error) {
    return console.error(error)
  }

  if (data.user) {
    const { error } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: formData.username,
      full_name: `${formData.first_name} ${formData.last_name}`
    })
    if (error) console.log('Profile err: ', error)
  }
  return true;
}