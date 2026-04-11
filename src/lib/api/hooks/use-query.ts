import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../axios'
import type { AxiosRequestConfig } from 'axios'

export function useApiQuery<T>(
  queryKey: string[],
  url: string,
  config?: AxiosRequestConfig
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<T>(url, config)
      return response.data
    },
  })
}

export function useApiMutation<TData, TVariables = unknown>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post'
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient[method]<TData>(url, variables)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}