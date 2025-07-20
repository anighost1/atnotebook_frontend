import { NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register']

function decodeJwt(token) {
    try {
        const payload = token.split('.')[1]
        const decoded = Buffer.from(payload, 'base64').toString()
        return JSON.parse(decoded)
    } catch {
        return null
    }
}

async function attemptRefreshToken(refreshToken) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        })

        if (!res.ok) return null

        const data = await res.json()
        return data.access
    } catch (err) {
        console.error('Failed to refresh token:', err)
        return null
    }
}

export async function middleware(request) {
    const { pathname } = request.nextUrl

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next()
    }

    const accessToken = request.cookies.get('access')?.value
    const refreshToken = request.cookies.get('refresh')?.value

    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const isExpired = (token) => {
        const decoded = decodeJwt(token)
        return !decoded || decoded.exp * 1000 < Date.now()
    }

    if (!accessToken || isExpired(accessToken)) {
        if (refreshToken) {
            const newAccessToken = await attemptRefreshToken(refreshToken)

            if (newAccessToken) {
                const response = NextResponse.next()
                response.cookies.set('access', newAccessToken)
                return response
            }
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|login|register|_next|favicon.ico).*)'],
}