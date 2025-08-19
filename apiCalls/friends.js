import api from "@/lib/axios"

export const getFriendsApi = async () => {
    return await api.get(`/api/users/friend/`)
}

export const getPendingRequestsApi = async () => {
    return await api.get(`/api/users/friend/?status=pending`)
}

export const addFriendApi = async (data) => {
    return await api.post(`/api/users/friend/`, data)
}

export const acceptRequestApi = async (request_id) => {
    return await api.patch(`/api/users/friend/${request_id}/`, { status: 'accepted' })
}

export const searchUserApi = async (data) => {
    return await api.get(`/api/users/search/?q=${data}`)
}