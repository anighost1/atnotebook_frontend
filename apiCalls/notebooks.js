import api from "@/lib/axios"

export const getNotebooksApi = async (collab = false) => {
    return await api.get(`/api/notebook/${collab ? '?forSelf=false&forCollab=true' : ''}`)
}

export const createNotebooksApi = async (data) => {
    return await api.post(`/api/notebook/`, data)
}

export const addCollaboratorApi = async (data) => {
    return await api.post(`/api/notebook/collaborator/`, data)
}

export const deleteNotebooksApi = async (id) => {
    return await api.delete(`/api/notebook/${id}/`)
}