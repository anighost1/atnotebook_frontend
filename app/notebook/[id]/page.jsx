"use client"

import { Badge } from '@/components/ui/badge'
import Cookies from 'js-cookie'
import { BadgeCheckIcon } from 'lucide-react'
import { use, useEffect, useRef, useState } from 'react'

export default function Notebook({ params }) {

    const { id } = use(params)

    const [messages, setMessages] = useState([])
    const [connectedUsers, setConnectedUsers] = useState([])
    const socketRef = useRef(null)
    const token = Cookies.get('access')

    useEffect(() => {
        if (!token) {
            console.warn('No token found in cookies')
            return
        }

        const encodedToken = encodeURIComponent(token)
        const wsUrl = `ws://localhost:8000/ws/notebook-collab/?id=${id}&token=${encodedToken}`

        const socket = new WebSocket(wsUrl)
        socketRef.current = socket

        socket.onopen = () => {
            console.log('WebSocket connected')
            socket.send(JSON.stringify({ type: 'join', notebook_id: id }))
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data?.type === 'user_list') {
                setConnectedUsers(data?.users)
            }
            setMessages(prev => [...prev, JSON.stringify(data)])
        }

        socket.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        socket.onclose = () => {
            console.log('WebSocket closed')
        }

        return () => {
            socket.close()
        }

    }, [])

    return (
        <div className="p-4 ">
            <div className='flex flex-row gap-2 justify-start items-center '>
                {connectedUsers.map((user, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                    >
                        <BadgeCheckIcon />
                        {user}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
