export const validateEmail = (email:string)=>{
  const trimedEmail = email.trim()
  if(!trimedEmail) return []

  const errors = []

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmailFormat = emailRegex.test(trimedEmail)

  if(!isValidEmailFormat) errors.push('Invalid email format')

  return errors
}

export const validatePassword = (password:string)=>{
  if(!password) return []

  const errors = []

  if(password.length <= 6) errors.push('Password must be at least 6 characters long')

  if(!password.includes('@')) errors.push('Password must contain at least one special character')

  return errors
}
