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
  
  return {
    ...validated,
    user: mapUserFromDTO(validated.user),
  }
}

export async function logout() {
}