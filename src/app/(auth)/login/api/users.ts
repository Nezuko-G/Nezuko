import { z } from 'zod'
import { UserDTO } from '../types/user.dto'
import { mapUserFromDTO } from '../mappers/user.mapper'
import { apis } from '@/lib/api/config'
import api from "@/lib/axios/core/instance"

export async function login(email: string, password: string) {                                                                 
  const response = await api.post(apis.auth.login, { email, password })
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
  await api.post(apis.auth.logout)
}