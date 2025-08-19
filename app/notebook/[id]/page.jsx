"use client"

import { Badge } from '@/components/ui/badge'
import debounce from 'lodash/debounce'
import Cookies from 'js-cookie'
import { BadgeCheckIcon } from 'lucide-react'
import { use, useEffect, useRef, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import AddCollaborator from '@/components/notebook/addCollaborator'
import UserDetailsFetcher from '@/lib/userDetailsFetcher'

export default function Notebook({ params }) {

    const { id } = use(params)

    const [notebookData, setNotebookData] = useState({})
    const [notebookContent, setNotebookContent] = useState('')
    const [connectedUsers, setConnectedUsers] = useState([])
    const socketRef = useRef(null)
    const token = Cookies.get('access')
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        if (!token) {
            console.warn('No token found in cookies')
            return
        }

        const encodedToken = encodeURIComponent(token)
        const wsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_WS}/ws/notebook-collab/?id=${id}&token=${encodedToken}`

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
            if (data?.type === 'notebook_data') {
                setNotebookData(data?.notebook)
                setNotebookContent(data?.notebook?.content)
            }
            if (data?.type === 'notebook_update') {
                setNotebookContent(data?.content)
            }
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

    const debouncedSend = useRef(
        debounce((content) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        type: 'update_notebook',
                        content,
                    })
                )
            }
        }, 500)
    ).current

    useEffect(() => {
        const data = UserDetailsFetcher()
        console.log(data,notebookData)
        setCurrentUser(data)
    }, [])

    return (
        <div className="p-4 flex flex-col gap-4 ">
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
            <div className="grid w-full gap-3">
                <div className='flex flex-row justify-between items-center'>
                    <Label htmlFor="message">{notebookData?.title}</Label>
                    {notebookData?.owner_id === currentUser?.user_id && (<AddCollaborator notebookData={notebookData} />)}
                </div>
                <Textarea
                    placeholder="Notebook Data"
                    id="message"
                    value={notebookContent}
                    onChange={(e) => {
                        const value = e.target.value
                        setNotebookContent(value)
                        debouncedSend(value)
                    }}
                    className={'min-h-[50vh]'}
                />
            </div>
        </div>
    );
}
