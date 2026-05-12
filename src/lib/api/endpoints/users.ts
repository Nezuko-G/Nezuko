import { z } from 'zod'
import apiClient from 'axios'
import { UserDTO } from '@/types/dto/user.dto'
import { mapUserFromDTO } from '@/lib/mappers/user.mapper'
import { apis } from '../config'



export async function login(email: string, password: string) {                                                                            
  const response = await apiClient.post(apis.auth.login, { email, password })
  const validated = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: UserDTO,
  }).parse(response.data)
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', validated.accessToken)
    localStorage.setItem('refreshToken', validated.refreshToken)
  }
  
  return {
    ...validated,
    user: mapUserFromDTO(validated.user),
  }
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}