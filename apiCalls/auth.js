import api from "@/lib/axios"

export const login = async (data) => {
    return await api.post(`/api/login/`, data)
}

export const refresh = async (data) => {
    return await api.post(`/api/token/refresh/`, data)
}

export const register = async (data) => {
    return await api.post(`/api/users/`, data)
}