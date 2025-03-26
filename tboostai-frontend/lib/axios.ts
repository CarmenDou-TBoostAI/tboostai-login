import axios, { AxiosInstance,  AxiosError } from 'axios'
import { getAuth, clearAuth } from './auth'
import { toast } from '@/hooks/use-toast'

export const authApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BACKEND_URL
})

export const userApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_BACKEND_URL
})

export const chatApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAT_BACKEND_URL
})


export const dataApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DATA_BACKEND_URL
})
export const navigate = (path: string) => {
  // 使用 history API
  window.history.pushState({}, '', path)
  // 触发路由更新事件
  window.dispatchEvent(new PopStateEvent('popstate'))
}

interface ErrorResponse {
  detail: string;
}

// 立即为两个实例设置拦截器
const apis = [authApi, userApi, chatApi, dataApi] as const;
apis.forEach(api => {
  api.interceptors.request.use((config) => {
    const { token } = getAuth()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  })

  api.interceptors.response.use(
    (response) => {
        // Don't intercept if it's a need_login response
        if (response.data?.need_login) {
            return response
        }
        return response
    },
    (error: AxiosError) => {
    console.log("=== Axios Error Interceptor ===")
    console.log("Intercepting error:", error.response?.data)

    // 忽略 "Chat session not found" 错误的 toast
    if (error.response?.status === 404 && 
        (error.response?.data as ErrorResponse)?.detail === 'Chat session not found') {
        return Promise.reject(error)
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理认证相关错误
          clearAuth()
          const errorDetail = (error.response.data as ErrorResponse)?.detail
          
          // 其他认证错误（Invalid token 或 Missing/invalid authorization header）
          navigate(`/login?error=${encodeURIComponent(errorDetail)}`)
          return new Promise(() => {})  // 阻止错误继续传播

        case 500:
          // 服务器内部错误
          toast({
            title: "Server Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
            duration: 5000
          })
          break

        default:
          // 其他错误
          toast({
            title: "Error",
            description: (error.response.data as ErrorResponse)?.detail || "An unexpected error occurred.",
            variant: "destructive",
            duration: 5000
          })
      }
    } else if (error.request) {
      // 网络错误
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
        duration: 5000
      })
    } else {
      // 请求设置错误
      toast({
        title: "Request Error",
        description: error.message || "An error occurred while setting up the request.",
        variant: "destructive",
        duration: 5000
      })
    }

    return Promise.reject(error)
  }
)
})




// const apis = [authApi, userApi] as const;
// apis.forEach(api => {
//   api.interceptors.request.use((config) => {
//     const { token } = getAuth()
//     if (token) {
//       config.headers = config.headers || {}
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   })

//   api.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//       console.log("=== Axios Error Interceptor ===")
//       console.log("Intercepting error:", error.response?.data)

//       if (error.response?.status === 401 && 
//         (error.response?.data as ErrorResponse)?.detail.includes('token_expired')) {
//         console.log("Token expired detected, clearing auth...")
        
      
//         // clearAuth()
        
    
        
//           window.location.href = '/login?status=session_expired'
//           return new Promise(() => {})
        
//       }
      
//       return Promise.reject(error)
//     }
//   )
// })

