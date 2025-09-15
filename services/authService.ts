import api from './api'

export const authService = {
    login: async (loginData: {emailOrUsername: string, password: string}) => {
        const response = await api.post('auth/login', loginData)
        return response.data
    }
}