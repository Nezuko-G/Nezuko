export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
}