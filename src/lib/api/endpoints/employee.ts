import apiClient from '@/lib/axios/core/instance';
export async function getEmployees() {
  const response = await apiClient.get('/employee');
  
  return response.data.data.employees; 
}