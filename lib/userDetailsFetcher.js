"use client"

import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'

export default function UserDetailsFetcher() {
    try {
        const token = Cookies.get('access')
        return decodeToken(token)
    } catch (err) {
        console.log(err)
    }
}