import { z } from 'zod'
import apiClient from '../axios'
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '@/types/dto/user.dto'
import { mapUserFromDTO, mapUsersFromDTO } from '@/lib/mappers/user.mapper'
import { apis } from '../config'

export async function getUsers() {
  const response = await apiClient.get<z.infer<typeof UserDTO>[]>('/users')
  return mapUsersFromDTO(response.data)
}

export async function getUser(id: string) {
  const response = await apiClient.get<z.infer<typeof UserDTO>>(`/users/${id}`)
  return mapUserFromDTO(response.data)
}

export async function createUser(data: z.infer<typeof CreateUserDTO>) {
  const validated = CreateUserDTO.parse(data)
  const response = await apiClient.post<z.infer<typeof UserDTO>>('/users', validated)
  return mapUserFromDTO(response.data)
}

export async function updateUser(id: string, data: z.infer<typeof UpdateUserDTO>) {
  const validated = UpdateUserDTO.parse(data)
  const response = await apiClient.patch<z.infer<typeof UserDTO>>(`/users/${id}`, validated)
  return mapUserFromDTO(response.data)
}

export async function deleteUser(id: string) {
  await apiClient.delete(`/users/${id}`)
}

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