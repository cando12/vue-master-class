import type { LoginForm } from "@/types/AuthForm"
import { AuthError } from "@supabase/supabase-js"

type FormErrors<T> = {
  [K in keyof T]: string[]
}

export const useFormErrors = () => {
  // ...
  const serverError = ref('')
  const realTimeError = ref<FormErrors<LoginForm>>()

  const handleServerError = (error:AuthError)=>{
    serverError.value =
    error?.message === 'Invalid login credentials'
      ? 'Invalid email or password'
      : error?.message || ''
  }

  const handleLoginForm = async (formData:LoginForm)=>{
    realTimeError.value = {
      email:[],
      password:[]
    }
    const {validateEmail,validatePassword} = await import('@/utils/formValidations')

    const emailErrors = validateEmail(formData.email)
    const passwordErrors = validatePassword(formData.password)

    if(emailErrors.length > 0) realTimeError.value.email = emailErrors
    if(passwordErrors.length > 0) realTimeError.value.password = passwordErrors
  }

  return {
    serverError,
    handleServerError,
    realTimeError,
    handleLoginForm
  }
}
