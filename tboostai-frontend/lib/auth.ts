import { queryClient } from './query-client'
// 定义用户类型
export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
  }
  
  // 保存认证信息
  export const setAuth = (token: string, user: User, sessionId?: string) => {

    clearAuth()
    localStorage.removeItem('chat_session_id')

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    if (sessionId) {
      localStorage.setItem('chat_session_id', sessionId)
  }
  }
  
  // 获取认证信息
  export const getAuth = () => {
    if (typeof window === 'undefined') {
      return { token: null, user: null, chatSessionId: null };
    }
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const chatSessionId = localStorage.getItem('chat_session_id')
    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
      chatSessionId
    }
  }
  
  // 清除认证信息
  export const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('chat_session_id')
  }
  
  // 检查是否已认证
  export const isAuthenticated = () => {
    if (typeof window === 'undefined') {
      return false
    }
    const token = localStorage.getItem('token')
    return !!token && token !== 'undefined'
  }