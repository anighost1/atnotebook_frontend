"use client"

import Cookies from 'js-cookie';

export default function decodedToken() {
    const token = Cookies.get('access');
    try {
        const payload = token.split('.')[1]
        const decoded = Buffer.from(payload, 'base64').toString()
        return JSON.parse(decoded)
    } catch {
        return null
    }
}