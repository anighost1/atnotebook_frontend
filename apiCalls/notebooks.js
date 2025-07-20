import api from "@/lib/axios"

export const getNotebooksApi = async () => {
    return await api.get(`/api/notebook/`)
}

export const createNotebooksApi = async (data) => {
    return await api.post(`/api/notebook/`, data)
}

export const deleteNotebooksApi = async (id) => {
    return await api.delete(`/api/notebook/${id}/`)
}